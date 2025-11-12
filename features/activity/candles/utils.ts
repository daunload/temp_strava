export const DateUtils = {
	/** Date 객체를 'YYYYMMDD' 형태의 문자열로 변환 */
	toYyyymmdd(date: Date): string {
		return date.toISOString().slice(0, 10).replace(/-/g, '')
	},
	/** 해당 날짜의 시간 정보를 00:00:00으로 변환 */
	stripTime(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate())
	},
	/** 두 날짜 사이의 일 수 차이를 반환 */
	diffDays(start: Date, end: Date): number {
		const startMs = this.stripTime(start).getTime()
		const endMs = this.stripTime(end).getTime()
		return Math.round((endMs - startMs) / 86400000)
	},
}
