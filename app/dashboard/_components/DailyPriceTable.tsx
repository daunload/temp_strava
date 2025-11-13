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
import { StockCandle } from '@/features/activity/candles'
import { useState } from 'react'

interface DailyPriceProps {
	stockCandles: StockCandle[]
}
export function DailyPriceTable({ stockCandles }: DailyPriceProps) {
	const [page, setPage] = useState(1)
	const pageSize = 10

	const totalPages = Math.ceil(stockCandles.length / pageSize)

	const visibleCandles = stockCandles
		.toReversed()
		.slice((page - 1) * pageSize, page * pageSize)

	const goToPage = (p: number) => {
		if (p < 1 || p > totalPages) return
		setPage(p)
	}

	const dayOnDayChange = (
		currentCandle: StockCandle,
		previousCandle?: StockCandle,
	) => {
		if (!previousCandle) return 0

		return currentCandle.openClose[1] - previousCandle.openClose[1]
	}
	const rateOfChange = (
		currentCandle: StockCandle,
		previousCandle?: StockCandle,
	) => {
		if (!previousCandle) return 0

		const change = dayOnDayChange(currentCandle, previousCandle)
		const percentageChange = (change / previousCandle.openClose[1]) * 100
		return percentageChange.toFixed(1)
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">일자</TableHead>
						<TableHead>종가</TableHead>
						<TableHead>전일대비</TableHead>
						<TableHead>등락률</TableHead>
						<TableHead>시가</TableHead>
						<TableHead>고가</TableHead>
						<TableHead>저가</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{visibleCandles.map((candle, index, candles) => (
						<TableRow key={index}>
							<TableCell className="font-medium">
								{candle.date}
							</TableCell>
							<TableCell>{candle.openClose[1]}</TableCell>
							<TableCell>
								{dayOnDayChange(
									candle,
									candles[index + 1] ?? null,
								)}
							</TableCell>
							<TableCell>
								{rateOfChange(
									candle,
									candles[index + 1] ?? null,
								)}
								%
							</TableCell>
							<TableCell>{candle.openClose[0]}</TableCell>
							<TableCell>{candle.highLow[0]}</TableCell>
							<TableCell>{candle.highLow[1]}</TableCell>
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
