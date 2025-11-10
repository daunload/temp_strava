import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('strava_access_token')?.value

	if (accessToken) {
		return redirect('/dashboard')
	}

	return (
		<div className="dark:bg-neutral-800 h-full">
			<header></header>
			<div className="flex justify-center items-center h-full">
				<a href="/api/strava">
					<Button>strava 인증하기</Button>
				</a>
			</div>
		</div>
	)
}
