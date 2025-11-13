import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { convertToPaceCandles } from '@/features/activity/candles'
import { convertToCadenceCandles } from '@/features/activity/candles/cadence.mapper'
import { convertToHeartRateCandles } from '@/features/activity/candles/heartRate.mapper'
import { convertToRunCandles } from '@/features/activity/candles/running.mapper'
import { getStravaActivities } from '@/lib/strava/api'
import { getStravaContext } from '@/lib/strava/context'
import { ActivityTable } from './_components/ActivityTable'
import { DailyPriceTable } from './_components/DailyPriceTable'
import StockCard from './_components/StockCard'
import { StockChart } from './_components/StockChart'

export default async function DashboardPage() {
	const ctx = await getStravaContext()
	const activities = await getStravaActivities(ctx, {
		page: 1,
		perPage: 100,
	})

	const runCandles = convertToRunCandles(activities)
	const heartRateCandles = convertToHeartRateCandles(activities)
	const cadenceCandles = convertToCadenceCandles(activities)
	const paceCandles = convertToPaceCandles(activities)

	const stockData = [
		{ title: '러닝 지수', stockCandles: runCandles },
		{ title: '심박수', stockCandles: heartRateCandles },
		{ title: '케이던스', stockCandles: cadenceCandles },
		{ title: '페이스', stockCandles: paceCandles },
	]

	return (
		<div className="flex flex-1 flex-col gap-4">
			<div className="grid gap-2 grid-cols-2 lg:grid-cols-4 w-full">
				{stockData.map((data) => (
					<StockCard
						key={data.title}
						title={data.title}
						stockCandles={data.stockCandles}
					/>
				))}
			</div>
			<Card className="w-full p-0">
				<StockChart title="러닝 지수" stockCandles={runCandles} />
			</Card>
			<Card>
				<CardHeader>
					<p className="text-lg font-bold text-muted-foreground">
						일별 시세
					</p>
				</CardHeader>
				<CardContent>
					<DailyPriceTable stockCandles={runCandles} />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<p className="text-lg font-bold text-muted-foreground">
						러닝량
					</p>
				</CardHeader>
				<CardContent>
					<ActivityTable activities={activities}></ActivityTable>
				</CardContent>
			</Card>
		</div>
	)
}
