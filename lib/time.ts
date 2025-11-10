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
