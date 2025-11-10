import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { SummaryActivity } from '@/lib/strava/types'

interface ActivityTableProps {
	activities: SummaryActivity[]
}
export function ActivityTable({ activities }: ActivityTableProps) {
	return (
		<Card>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">날짜</TableHead>
						<TableHead>제목</TableHead>
						<TableHead>거리</TableHead>
						<TableHead>평균 속도</TableHead>
						<TableHead>평균 심박수</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{activities.map((activity) => (
						<TableRow key={activity.id}>
							<TableCell className="font-medium">
								{activity.start_date}
							</TableCell>
							<TableCell>{activity.name}</TableCell>
							<TableCell>{activity.distance}</TableCell>
							<TableCell>{activity.average_speed}</TableCell>
							<TableCell>{activity.average_heartrate}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	)
}
