import { exchangeStravaCodeForToken } from '@/lib/strava/oauth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const code = searchParams.get('code')

	if (!code) {
		return NextResponse.redirect(
			new URL('/auth/error?reason=no_code', req.url),
		)
	}

	const { access_token, refresh_token, expires_at, athlete } =
		await exchangeStravaCodeForToken(code)

	const res = NextResponse.redirect(new URL('/dashboard', req.url))

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
