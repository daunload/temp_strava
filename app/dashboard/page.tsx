import { Card, CardContent } from '@/components/ui/card'
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
		<>
			<div className="flex flex-1 rounded-lg shadow-sm">
				<Card className="w-full">
					<CardContent>
						<ActivityTable activities={activities}></ActivityTable>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
