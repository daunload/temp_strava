import type { StravaContext } from './context'
import { DetailedAthlete, SummaryActivity } from './types'

const STRAVA_API_BASE = 'https://www.strava.com'

async function stravaFetch<T>(
	ctx: StravaContext,
	path: string,
	params?: Record<string, string | number | undefined>,
): Promise<T> {
	const url = new URL('api/v3' + path, STRAVA_API_BASE)

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.set(key, String(value))
			}
		})
	}

	const res = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${ctx.accessToken}`,
			Accept: 'application/json',
		},
	})

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		console.error('Strava API error', {
			path,
			status: res.status,
			body: text,
		})
		throw new Error(`STRAVA_API_ERROR_${res.status}`)
	}

	return await res.json()
}

export interface GetActivitiesOptions {
	page?: number
	perPage?: number
	after?: number
	before?: number
}
export async function getStravaActivities(
	ctx: StravaContext,
	options: GetActivitiesOptions = {},
) {
	const { page = 1, perPage = 10, after, before } = options

	return await stravaFetch<SummaryActivity[]>(ctx, '/athlete/activities', {
		page,
		per_page: perPage,
		after,
		before,
	})
}

export async function getAthlete(ctx: StravaContext) {
	return await stravaFetch<DetailedAthlete>(ctx, '/athlete')
}
