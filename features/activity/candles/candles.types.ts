export interface StockCandle {
	date: string
	openClose: [number, number]
	highLow: [number, number]
}

export interface DailyCandle {
	dateKey: string
	date: Date
	open: number
	close: number
	low: number
	high: number
}
