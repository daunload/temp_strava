import { StockCandle } from '@/app/dashboard/_components/StockChart'
import { SummaryActivity } from './types'

const INITIAL_PRICE = 1000

/** 하루 안 뛴 날당 하락률 (2% 하락) */
const IDLE_DROP_RATE = 0.02
/** 하루 총 거리 5km를 기준으로 2% 상승 (더 뛰면 더 많이 오름) */
const BASE_DISTANCE_KM = 5
const RUN_GAIN_RATE = 0.02

const MAX_DISTANCE_MULTIPLIER = 2
const MIN_PRICE = 0

const DateUtils = {
	toYyyymmdd(date: Date): string {
		return date.toISOString().slice(0, 10).replace(/-/g, '')
	},

	stripTime(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate())
	},

	diffDays(start: Date, end: Date): number {
		const startMs = this.stripTime(start).getTime()
		const endMs = this.stripTime(end).getTime()
		return Math.round((endMs - startMs) / 86400000)
	},

	getWeekStart(date: Date): Date {
		const d = this.stripTime(date)
		const dayOfWeek = d.getDay()
		const daysFromMonday = (dayOfWeek + 6) % 7
		return new Date(d.getTime() - daysFromMonday * 86400000)
	},
}

class PriceCalculator {
	private currentPrice: number

	constructor(initialPrice = INITIAL_PRICE) {
		this.currentPrice = initialPrice
	}

	/** 휴식 기간을 가격에 적용 */
	applyIdleDays(idleDays: number): void {
		if (idleDays <= 0) return
		this.currentPrice *= Math.pow(1 - IDLE_DROP_RATE, idleDays)
		this.clamp()
	}

	/** 러닝 거리를 가격에 적용 */
	applyRunDistance(distance: number): number {
		const price = this.getPrice()
		const distanceFactor = Math.min(
			distance / BASE_DISTANCE_KM,
			MAX_DISTANCE_MULTIPLIER,
		)
		const gainRate = RUN_GAIN_RATE * distanceFactor

		this.currentPrice = price * (1 + gainRate)
		this.clamp()

		return price
	}

	getPrice(): number {
		return Math.round(this.currentPrice)
	}

	private clamp(): void {
		this.currentPrice = Math.max(MIN_PRICE, this.currentPrice)
	}
}

interface DailyCandle {
	dateKey: string
	date: Date
	open: number
	close: number
	low: number
	high: number
}

/** Map<활동 날짜, activity> 형태로 반환  */
function groupActivitiesByDate(
	activities: SummaryActivity[],
): Map<string, SummaryActivity[]> {
	const byDate = new Map<string, SummaryActivity[]>()

	for (const activity of activities) {
		const startDate = new Date(activity.start_date_local)
		const dateKey = DateUtils.toYyyymmdd(startDate)

		const activities = byDate.get(dateKey) ?? []
		activities.push(activity)
		byDate.set(dateKey, activities)
	}

	return byDate
}

/** 활동 데이터를 캔들 데이터로 변환 */
function createDailyCandles(
	activitiesByDate: Map<string, SummaryActivity[]>,
): DailyCandle[] {
	const sortedDates = Array.from(activitiesByDate.keys()).toSorted()
	const calculator = new PriceCalculator()
	const candles: DailyCandle[] = []
	let lastDate: Date | null = null
	let lastPrice: number | null = null

	for (const date of sortedDates) {
		const activities = activitiesByDate.get(date) ?? []
		const currentDate = DateUtils.stripTime(
			new Date(activities[0].start_date_local),
		)

		if (lastDate) {
			/** 휴식한 기간 */
			const idleDays = DateUtils.diffDays(lastDate, currentDate) - 1
			calculator.applyIdleDays(idleDays)
		}

		/** 오늘 하루 뛴 거리 */
		const totalDistance =
			activities.reduce((sum, a) => sum + a.distance, 0) / 1000

		const openPrice = lastPrice ?? 1000
		const closePrice = calculator.applyRunDistance(totalDistance)

		candles.push({
			dateKey: date,
			date: currentDate,
			open: openPrice,
			close: closePrice,
			low: Math.min(openPrice, closePrice),
			high: Math.max(openPrice, closePrice),
		})

		lastDate = currentDate
		lastPrice = closePrice
	}

	return candles
}

function convertWeeklyCandles(candles: DailyCandle[]): StockCandle[] {
	const weekMap = new Map<string, DailyCandle[]>()

	for (const candle of candles) {
		const weekStart = DateUtils.getWeekStart(candle.date)
		const weekKey = DateUtils.toYyyymmdd(weekStart)

		const weekCandles = weekMap.get(weekKey) ?? []
		weekCandles.push(candle)
		weekMap.set(weekKey, weekCandles)
	}

	return Array.from(weekMap.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([weekKey, weekCandles]) => {
			const sorted = weekCandles.sort((a, b) =>
				a.dateKey.localeCompare(b.dateKey),
			)
			const first = sorted[0]
			const last = sorted[sorted.length - 1]

			return {
				date: weekKey,
				openClose: [first.open, last.close],
				highLow: [
					Math.min(...sorted.map((c) => c.low)),
					Math.max(...sorted.map((c) => c.high)),
				],
			}
		})
}

export function convertToDailyCandles(
	activities: SummaryActivity[],
): StockCandle[] {
	const runs = activities
		.filter((a) => a.sport_type === 'Run' || a.type === 'Run')
		.sort(
			(a, b) =>
				new Date(a.start_date_local).getTime() -
				new Date(b.start_date_local).getTime(),
		)

	if (runs.length === 0) return []

	const activitiesByDate = groupActivitiesByDate(runs)
	const dailyCandles = createDailyCandles(activitiesByDate)

	return dailyCandles.map((candle) => {
		return {
			date: candle.dateKey,
			openClose: [candle.open, candle.close],
			highLow: [candle.low, candle.high],
		}
	})
}

export function convertToWeeklyCandles(
	activities: SummaryActivity[],
): StockCandle[] {
	const runs = activities
		.filter((a) => a.sport_type === 'Run' || a.type === 'Run')
		.sort(
			(a, b) =>
				new Date(a.start_date_local).getTime() -
				new Date(b.start_date_local).getTime(),
		)

	if (runs.length === 0) return []

	const activitiesByDate = groupActivitiesByDate(runs)
	const dailyCandles = createDailyCandles(activitiesByDate)
	return convertWeeklyCandles(dailyCandles)
}
