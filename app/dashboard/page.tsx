import { Card, CardContent } from '@/components/ui/card'
import {
	convertToDailyCandles,
	convertToWeeklyCandles,
} from '@/lib/strava/activityCandles'
import { getStravaActivities } from '@/lib/strava/api'
import { getStravaContext } from '@/lib/strava/context'
import { ActivityTable } from './_components/ActivityTable'
import { StockChart } from './_components/StockChart'

export default async function DashboardPage() {
	const ctx = await getStravaContext()
	const activities = await getStravaActivities(ctx, {
		page: 1,
		perPage: 100,
	})

	const activityCandles = convertToWeeklyCandles(activities)

	return (
		<>
			<div className="flex flex-1 rounded-lg shadow-sm">
				<Card className="w-full">
					{/* <CardContent>
						<ActivityTable activities={activities}></ActivityTable>
					</CardContent> */}
					<CardContent>
						<StockChart
							title="러닝 지수 (일간) - 나에게 투자한 그래프 📈"
							stockCandles={activityCandles}
						></StockChart>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
