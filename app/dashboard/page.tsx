import { getStravaActivities } from '@/lib/strava/api'
import { getStravaContext } from '@/lib/strava/context'
import { ActivityTable } from './_components/ActivityTable'

export default async function DashboardPage() {
	const ctx = await getStravaContext()
	const activities = await getStravaActivities(ctx, {
		page: 1,
		perPage: 10,
	})

	return (
		<div className="flex flex-1 p-8 h-full">
			<header>dashboard page</header>

			<div className="">
				<ActivityTable activities={activities}></ActivityTable>
			</div>
		</div>
	)
}
