import { cookies } from 'next/headers'

export type StravaContext = {
	accessToken: string
}

export async function getStravaContext(): Promise<StravaContext> {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('strava_access_token')?.value

	if (!accessToken) throw new Error('STRAVA_ACCESS_TOKEN_MISSING')

	return { accessToken }
}
