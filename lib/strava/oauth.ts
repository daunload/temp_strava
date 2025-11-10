const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'

export async function exchangeStravaCodeForToken(code: string) {
	const clientId = process.env.STRAVA_CLIENT_ID
	const clientSecret = process.env.STRAVA_CLIENT_SECRET

	if (!clientId || !clientSecret) throw new Error('STRAVA_ENV_MISSING')

	const params = new URLSearchParams()
	params.set('client_id', clientId)
	params.set('client_secret', clientSecret)
	params.set('code', code)
	params.set('grant_type', 'authorization_code')

	const response = await fetch(STRAVA_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: params.toString(),
	})

	if (!response.ok) {
		const text = await response.text().catch(() => '')
		console.error('Strava OAuth error', {
			status: response.status,
			body: text,
		})
		throw new Error('STRAVA_OAUTH_FAILED')
	}

	return await response.json()
}
