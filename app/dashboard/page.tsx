import { convertToRunCandles } from '@/features/activity/candles/running.mapper'
import { getStravaActivities } from '@/lib/strava/api'
import { getStravaContext } from '@/lib/strava/context'
import { ActivityTable } from './_components/ActivityTable'
import StockCard from './_components/StockCard'
import { StockChart } from './_components/StockChart'

export default async function DashboardPage() {
	const ctx = await getStravaContext()
	const activities = await getStravaActivities(ctx, {
		page: 1,
		perPage: 100,
	})

	const runCandles = convertToRunCandles(activities)

	return (
		<>
			<div className="flex flex-1 rounded-lg shadow-sm">
				<div className="flex gap-2 w-full">
					<StockCard
						title="러닝 지수"
						stockCandles={runCandles}
					></StockCard>
					<StockCard
						title="러닝 지수"
						stockCandles={runCandles}
					></StockCard>
					<StockCard
						title="러닝 지수"
						stockCandles={runCandles}
					></StockCard>
					<StockCard
						title="러닝 지수"
						stockCandles={runCandles}
					></StockCard>
				</div>
			</div>
		</>
	)
}
