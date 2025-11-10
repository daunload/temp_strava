import { getStravaActivities } from '@/lib/strava/api'
import { getStravaContext } from '@/lib/strava/context'

export default async function DashboardPage() {
	const ctx = await getStravaContext()
	const activities = await getStravaActivities(ctx, {
		page: 1,
		perPage: 10,
	})

	return (
		<div>
			dashboard page
			<ul>
				{activities.map((a) => (
					<li key={a.id}>
						{a.name} · {a.distance}m
					</li>
				))}
			</ul>
		</div>
	)
}
