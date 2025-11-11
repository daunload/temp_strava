export const secondsToMinutes = (seconds: number): number => {
	return Math.floor(seconds / 60)
}

export const formatSecondsToMmSs = (totalSeconds: number): string => {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.floor(totalSeconds % 60)

	const mm = String(minutes).padStart(2, '0')
	const ss = String(seconds).padStart(2, '0')

	return `${mm}:${ss}`
}

export function formatDateForLWC(yyyymmdd: string): string {
	const year = yyyymmdd.slice(0, 4)
	const month = yyyymmdd.slice(4, 6)
	const day = yyyymmdd.slice(6, 8)
	return `${year}-${month}-${day}`
}
