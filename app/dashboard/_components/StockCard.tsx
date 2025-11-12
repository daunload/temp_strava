import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StockCandle } from '@/lib/strava/activityCandles'

interface StockCardProps {
	title: string
	stockCandles: StockCandle[]
}

export default function StockCard({ title, stockCandles }: StockCardProps) {
	const lastCandle = stockCandles.at(-1)
	const closePrice = lastCandle?.openClose[1] ?? 0
	const openPrice = lastCandle?.openClose[0] ?? 0
	const change = ((closePrice - openPrice) / openPrice) * 100

	const changeColorClass =
		change > 0
			? 'text-red-500'
			: change < 0
				? 'text-blue-500'
				: 'text-muted-foreground'

	const formattedClosePrice = `${closePrice.toLocaleString('ko-KR')}원`
	const formattedChange = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`

	return (
		<Card className="w-full">
			<CardHeader className="pb-2">
				<p className="text-lg font-medium text-muted-foreground">
					{title}
				</p>
			</CardHeader>
			<CardContent className="flex flex-col items-start gap-1">
				<p className="text-2xl font-semibold tracking-tight">
					{formattedClosePrice}
				</p>
				<p className={`text-sm font-medium ${changeColorClass}`}>
					{formattedChange}
				</p>
			</CardContent>
		</Card>
	)
}
