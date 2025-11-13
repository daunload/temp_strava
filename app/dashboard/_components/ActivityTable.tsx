'use client'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
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
import { useState } from 'react'

interface ActivityTableProps {
	activities: SummaryActivity[]
}
export function ActivityTable({ activities }: ActivityTableProps) {
	const [page, setPage] = useState(1)
	const pageSize = 10

	const totalPages = Math.ceil(activities.length / pageSize)

	const visibleActivities = activities.slice(
		(page - 1) * pageSize,
		page * pageSize,
	)

	const goToPage = (p: number) => {
		if (p < 1 || p > totalPages) return
		setPage(p)
	}

	return (
		<div>
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
					{visibleActivities.map((activity) => (
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
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={(e) => {
								e.preventDefault()
								goToPage(page - 1)
							}}
						/>
					</PaginationItem>
					{[...Array(totalPages)].map((_, idx) => {
						const pageNum = idx + 1
						return (
							<PaginationItem key={pageNum}>
								<PaginationLink
									href="#"
									isActive={page === pageNum}
									onClick={(e) => {
										e.preventDefault()
										goToPage(pageNum)
									}}
								>
									{pageNum}
								</PaginationLink>
							</PaginationItem>
						)
					})}
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={(e) => {
								e.preventDefault()
								goToPage(page + 1)
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
