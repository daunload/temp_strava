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
import { formatDateForLWC } from '@/lib/time'
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

	const getPriceChange = (
		currentCandle: StockCandle,
		previousCandle?: StockCandle,
	) => {
		if (!previousCandle) return 0

		return currentCandle.openClose[1] - previousCandle.openClose[1]
	}
	const getRateOfChange = (
		currentCandle: StockCandle,
		previousCandle?: StockCandle,
	) => {
		if (!previousCandle) return 0

		const change = getPriceChange(currentCandle, previousCandle)
		const percentageChange = (change / previousCandle.openClose[1]) * 100
		return +percentageChange.toFixed(1)
	}

	const changeTextColor = (change: number) => {
		return change > 0
			? 'text-red-500'
			: change < 0
				? 'text-blue-500'
				: 'text-muted-foreground'
	}
	const formattedChange = (change: number) =>
		`${change > 0 ? '+' : ''}${change}`

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow className="font-bold">
						<TableHead className="text-right">일자</TableHead>
						<TableHead className="text-right">종가</TableHead>
						<TableHead className="text-right">전일대비</TableHead>
						<TableHead className="text-right">등락률</TableHead>
						<TableHead className="text-right">시가</TableHead>
						<TableHead className="text-right">고가</TableHead>
						<TableHead className="text-right">저가</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{visibleCandles.map((candle, index, candles) => {
						const priceChange = getPriceChange(
							candle,
							candles[index + 1] ?? null,
						)
						const rateOfChange = getRateOfChange(
							candle,
							candles[index + 1] ?? null,
						)

						return (
							<TableRow key={index} className="font-bold">
								<TableCell className="text-right">
									{formatDateForLWC(candle.date)}
								</TableCell>
								<TableCell className="text-right">
									{candle.openClose[1]}
								</TableCell>
								<TableCell
									className={`text-right ${changeTextColor(priceChange)}`}
								>
									{formattedChange(priceChange)}
								</TableCell>
								<TableCell
									className={`text-right ${changeTextColor(rateOfChange)}`}
								>
									{formattedChange(rateOfChange)}%
								</TableCell>
								<TableCell className="text-right">
									{candle.openClose[0]}
								</TableCell>
								<TableCell className="text-right">
									{candle.highLow[1]}
								</TableCell>
								<TableCell className="text-right">
									{candle.highLow[0]}
								</TableCell>
							</TableRow>
						)
					})}
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
