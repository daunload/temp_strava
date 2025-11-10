import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const code = searchParams.get('code')

	if (!code) {
		return NextResponse.redirect(
			new URL('/auth/error?reason=no_code', req.url),
		)
	}

	const clientId = process.env.STRAVA_CLIENT_ID
	const clientSecret = process.env.STRAVA_CLIENT_SECRET

	if (!clientId || !clientSecret) {
		return NextResponse.json(
			{ error: '환경변수 설징이 잘못되었습니다.' },
			{ status: 500 },
		)
	}

	const params = new URLSearchParams()
	params.append('client_id', clientId)
	params.append('client_secret', clientSecret)
	params.append('code', code)
	params.append('grant_type', 'authorization_code')

	const oauthResponse = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: params.toString(),
	})

	const oauthData = await oauthResponse.json()

	const { access_token, refresh_token, expires_at, athlete } = oauthData

	const res = NextResponse.redirect(new URL('/strava/dashboard', req.url))

	const maxAge = expires_at
		? expires_at - Math.floor(Date.now() / 1000)
		: 60 * 60 * 6

	res.cookies.set('strava_access_token', access_token, {
		httpOnly: true,
		secure: true,
		path: '/',
		maxAge,
		sameSite: 'lax',
	})

	// TODO - 리프레시 토큰 DB에 저장필요

	return res
}
