import { redirect } from 'next/navigation'

export function GET() {
	const redirectUri = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&approval_prompt=force&scope=read,activity:read_all`
	return redirect(redirectUri)
}
