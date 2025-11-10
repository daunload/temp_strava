import { Card } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { SummaryActivity } from '@/lib/strava/types'
import { formatSecondsToMmSs } from '@/lib/time'

interface ActivityTableProps {
	activities: SummaryActivity[]
}
export function ActivityTable({ activities }: ActivityTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">날짜</TableHead>
					<TableHead>제목</TableHead>
					<TableHead>거리</TableHead>
					<TableHead>시간</TableHead>
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
						<TableCell className="center">
							{formatSecondsToMmSs(activity.moving_time)}
						</TableCell>
						<TableCell>{activity.average_heartrate}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
