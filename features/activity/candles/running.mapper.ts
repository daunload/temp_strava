import { SummaryActivity } from '@/lib/strava/types'
import { DailyCandle, StockCandle } from './candles.types'
import { DateUtils } from './utils'

/** 최초 가격 */
const INITIAL_PRICE = 1000

/** 하루 안 뛴 날당 하락률 (2% 하락) */
const IDLE_DROP_RATE = 0.02

/** 하루 총 거리 5km를 기준으로 2% 상승 (더 뛰면 더 많이 오름) */
const BASE_DISTANCE_KM = 5
const RUN_GAIN_RATE = 0.02

/** 최소 가격 */
const MIN_PRICE = 0

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
		const distanceFactor = distance / BASE_DISTANCE_KM
		const gainRate = RUN_GAIN_RATE * distanceFactor

		this.currentPrice = price * (1 + gainRate)
		this.clamp()

		return price
	}

	getPrice(): number {
		return Math.round(this.currentPrice)
	}

	/** 가격이 최소값까지 떨어지지 않도록 */
	private clamp(): void {
		this.currentPrice = Math.max(MIN_PRICE, this.currentPrice)
	}
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

/** 러닝 활동 데이터를 캔들 데이터로 변환 */
function createRunCandles(
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

/** 러닝 활동 데이터를 캔들 데이터로 변환 */
export function convertToRunCandles(
	activities: SummaryActivity[],
): StockCandle[] {
	const runActivities = activities.filter(
		(activity) => activity.sport_type === 'Run' || activity.type === 'Run',
	)

	if (runActivities.length === 0) return []

	const sortedActivities = runActivities.toSorted(
		(a, b) =>
			new Date(a.start_date_local).getTime() -
			new Date(b.start_date_local).getTime(),
	)

	const activitiesByDate = groupActivitiesByDate(sortedActivities)
	const dailyCandles = createRunCandles(activitiesByDate)

	return dailyCandles.map((candle) => {
		return {
			date: candle.dateKey,
			openClose: [candle.open, candle.close],
			highLow: [candle.low, candle.high],
		}
	})
}
