'use client'

import { formatDateForLWC } from '@/lib/time'
import {
	CandlestickData,
	CandlestickSeries,
	ColorType,
	createChart,
	IChartApi,
} from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export interface StockCandle {
	date: string
	openClose: [number, number]
	highLow: [number, number]
}

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

		const resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0]
			if (!entry) return

			const { width, height } = entry.contentRect
			chart.resize(width, height)
		})

		resizeObserver.observe(container)

		return () => {
			resizeObserver.disconnect()
			chart.remove()
			chartRef.current = null
		}
	}, [])

	return (
		<div className="w-full h-80 border-gray-300 p-4">
			<h2 className="text-md text-gray-800 mb-2">{title}</h2>
			<div ref={containerRef} className="w-full h-[calc(100%-1.5rem)]" />
		</div>
	)
}
