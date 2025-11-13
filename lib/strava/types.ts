interface PolylineMap {
	id: string
	summary_polyline: string
}

export interface SummaryActivity {
	id: number
	external_id?: string
	upload_id?: number
	athlete: { id: number }
	name: string
	distance: number
	moving_time: number
	elapsed_time: number
	total_elevation_gain: number
	elev_high?: number
	elev_low?: number
	type?: string
	sport_type: string
	start_date: string
	start_date_local: string
	timezone: string
	start_latlng?: [number, number]
	end_latlng?: [number, number]
	achievement_count: number
	kudos_count: number
	comment_count: number
	athlete_count: number
	photo_count: number
	total_photo_count: number
	map?: PolylineMap
	device_name?: string
	trainer: boolean
	commute: boolean
	manual: boolean
	private: boolean
	flagged: boolean
	workout_type?: number
	upload_id_str?: string
	average_speed?: number
	max_speed?: number
	average_cadence: number
	has_kudoed: boolean
	hide_from_home: boolean
	gear_id?: string
	kilojoules?: number
	average_watts?: number
	device_watts?: boolean
	max_watts?: number
	weighted_average_watts?: number
	has_heartrate?: boolean
	average_heartrate?: number
	max_heartrate?: number
	pr_count?: number
	suffer_score?: number
}

export interface DetailedAthlete {
	id: bigint
	username: string
	resource_state: 3
	firstname: string
	lastname: string
	city: string
	state: string
	country: string
	sex: string
	premium: true
	created_at: string
	updated_at: string
	badge_type_id: 4
	profile_medium: string
	profile: string
	friend: any
	follower: any
	follower_count: number
	friend_count: number
	mutual_friend_count: number
	athlete_type: number
	date_preference: string
	measurement_preference: string
	clubs: any[]
	ftp: any
	weight: number
	bikes: any
	shoes: any[]
}
