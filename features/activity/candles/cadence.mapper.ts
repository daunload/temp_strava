import { SummaryActivity } from '@/lib/strava/types'
import { DailyCandle, StockCandle } from './candles.types'
import { DateUtils } from './utils'

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

/** 심박수 데이터를 캔들 데이터로 변환 */
function createCadenceCandles(
	activitiesByDate: Map<string, SummaryActivity[]>,
): DailyCandle[] {
	const sortedDates = Array.from(activitiesByDate.keys()).toSorted()
	const candles: DailyCandle[] = []
	let lastPrice: number | null = null

	for (const date of sortedDates) {
		const activities = activitiesByDate.get(date) ?? []
		const currentDate = DateUtils.stripTime(
			new Date(activities[0].start_date_local),
		)

		const averageCadence =
			activities.reduce((sum, a) => {
				return sum + (a.average_cadence ?? 0) * 2
			}, 0) / activities.length

		const openPrice = lastPrice ?? 0
		const closePrice = averageCadence

		candles.push({
			dateKey: date,
			date: currentDate,
			open: openPrice,
			close: closePrice,
			low: Math.min(openPrice, closePrice),
			high: Math.max(openPrice, closePrice),
		})

		lastPrice = closePrice
	}

	return candles
}

/** 심박수 데이터를 캔들 데이터로 변환 */
export function convertToCadenceCandles(
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
	const cadenceCandles = createCadenceCandles(activitiesByDate)

	return cadenceCandles.map((candle) => {
		return {
			date: candle.dateKey,
			openClose: [candle.open, candle.close],
			highLow: [candle.low, candle.high],
		}
	})
}
