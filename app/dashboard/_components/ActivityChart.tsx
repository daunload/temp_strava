'use client'

import { SummaryActivity } from '@/lib/strava/types'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface ActivityChartProps {
	activities: SummaryActivity[]
}

interface ActivityStock {
	date: string
	openClose: [number, number]
	highLow: [number, number]
}

const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, value))

function calcSessionScore(activity: SummaryActivity): number {
	const km = activity.distance / 1000
	const minutes = activity.moving_time / 60
	const elevation = activity.total_elevation_gain ?? 0

	const distNorm = clamp(km / 10, 0, 1)
	const timeNorm = clamp(minutes / 60, 0, 1)
	const elevNorm = clamp(elevation / 200, 0, 1)

	const score = (distNorm * 0.5 + timeNorm * 0.3 + elevNorm * 0.2) * 100

	return Math.round(score)
}

function toActivityStocks(activities: SummaryActivity[]): ActivityStock[] {
	const withMeta = activities.map((a) => {
		const dateObj = new Date(a.start_date_local)
		const yyyy = dateObj.getFullYear()
		const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
		const dd = String(dateObj.getDate()).padStart(2, '0')
		const dateKey = `${yyyy}${mm}${dd}`

		return {
			...a,
			dateKey,
			score: calcSessionScore(a),
			timestamp: dateObj.getTime(),
		}
	})

	// 2) 날짜별 그룹핑
	const byDate: Record<string, typeof withMeta> = {}

	for (const item of withMeta) {
		if (!byDate[item.dateKey]) {
			byDate[item.dateKey] = []
		}
		byDate[item.dateKey].push(item)
	}

	// 3) 날짜별로 open/close/high/low 계산해서 ActivityStock 생성
	const stocks: ActivityStock[] = Object.entries(byDate).map(
		([date, dayActivities]) => {
			dayActivities.sort((a, b) => a.timestamp - b.timestamp)

			const open = dayActivities[0].score
			const close = dayActivities[dayActivities.length - 1].score

			const scores = dayActivities.map((a) => a.score)
			const high = Math.max(...scores)
			const low = Math.min(...scores)

			return {
				date,
				openClose: [open, close],
				highLow: [low, high],
			}
		},
	)

	stocks.sort((a, b) => Number(a.date) - Number(b.date))

	return stocks
}

export function ActivityChart({ activities }: ActivityChartProps) {
	const data: ActivityStock[] = toActivityStocks(activities)
	console.log(data)

	return (
		<div className="w-full h-80 rounded-2xl border border-gray-800 bg-black/80 p-4">
			<h2 className="text-sm text-gray-300 mb-2">
				러닝 지수 (주간) – 나에게 투자한 그래프 📈
			</h2>
			<BarChart
				width={1000}
				height={500}
				data={data}
				margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
			>
				<XAxis dataKey="date" />
				<YAxis />
				<CartesianGrid strokeDasharray="2 2" />
				<Tooltip />

				<Bar dataKey="openClose" fill="#8884d8"></Bar>
			</BarChart>
		</div>
	)
}
