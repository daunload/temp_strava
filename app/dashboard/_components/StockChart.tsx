'use client'

import { StockCandle } from '@/features/activity/candles'
import { formatDateForLWC } from '@/lib/time'
import {
	CandlestickData,
	CandlestickSeries,
	ColorType,
	createChart,
	IChartApi,
} from 'lightweight-charts'
import { useEffect, useRef } from 'react'

interface StockChartProps {
	title: string
	stockCandles: StockCandle[]
}

export function StockChart({ title, stockCandles }: StockChartProps) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const chartRef = useRef<IChartApi | null>(null)

	useEffect(() => {
		if (!containerRef.current) return

		const container = containerRef.current

		const chart = createChart(container, {
			width: container.clientWidth,
			height: 200,
			layout: {
				background: { type: ColorType.Solid },
				textColor: '#1f2937',
			},
			grid: {
				vertLines: { color: '#e5e7eb' },
				horzLines: { color: '#e5e7eb' },
			},
			rightPriceScale: {
				borderColor: '#374151',
			},
			timeScale: {
				borderColor: '#374151',
			},
		})

		chartRef.current = chart

		const candlestickSeries = chart.addSeries(CandlestickSeries, {
			upColor: '#22c55e',
			downColor: '#ef4444',
			wickUpColor: '#22c55e',
			wickDownColor: '#ef4444',
			borderUpColor: '#22c55e',
			borderDownColor: '#ef4444',
		})

		const candleData: CandlestickData[] = stockCandles.map((candle) => {
			const [open, close] = candle.openClose
			const [low, high] = candle.highLow

			return {
				time: formatDateForLWC(candle.date),
				open,
				high,
				low,
				close,
			}
		})

		candlestickSeries.setData(candleData)

		chart.timeScale().fitContent()

		return () => {
			chart.remove()
			chartRef.current = null
		}
	}, [])
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

	const formattedChange = `${change > 0 ? '+' : ''}${closePrice - openPrice} (${change.toFixed(1)}%)`

	return (
		<div className="w-full border-gray-300 p-4">
			<h2 className="text-lg font-bold text-muted-foreground mb-2">
				{title}
			</h2>
			<p className="font-bold text-2xl">
				{`${stockCandles.at(-1)?.openClose[1]}원`}
			</p>
			<p className={`text-sm font-bold mb-4 ${changeColorClass}`}>
				{formattedChange}
			</p>
			<div ref={containerRef} />
		</div>
	)
}
