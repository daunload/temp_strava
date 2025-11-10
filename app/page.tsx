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
		<div className="flex items-center justify-center h-full">
			<div className="mx-auto grid max-w-[520px] flex-1 auto-rows-max gap-4 text-center">
				<a href="/api/strava">
					<Button>strava 인증하기</Button>
				</a>
			</div>
		</div>
	)
}
