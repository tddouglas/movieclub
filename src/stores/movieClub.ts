import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import type {MovieClub, Attendance} from '@/api/types'
import {MovieClubApiClient} from '@/api'

const movieClubApi = new MovieClubApiClient()

export const useMovieClubStore = defineStore('movieClub', () => {
	const movieClubs = ref<MovieClub[]>([])
	const seasonAttendance = ref<Attendance[]>([])
	const allTimeAttendance = ref<Attendance[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)

	const sortedMovieClubs = computed(() => {
		return [...movieClubs.value].sort((a, b) =>
			new Date(b.date).getTime() - new Date(a.date).getTime()
		)
	})

	async function fetchMovieClubs() {
		loading.value = true
		error.value = null
		try {
			movieClubs.value = await movieClubApi.getMovieClubs()
		} catch (e) {
			error.value = e instanceof Error ? e.message : 'Failed to fetch movie clubs'
		} finally {
			loading.value = false
		}
	}

	async function fetchAttendance() {
		loading.value = true
		error.value = null
		try {
			const [season, allTime] = await Promise.all([
				movieClubApi.getAttendance('season'),
				movieClubApi.getAttendance('all-time')
			])
			seasonAttendance.value = season
			allTimeAttendance.value = allTime
		} catch (e) {
			error.value = e instanceof Error ? e.message : 'Failed to fetch attendance'
		} finally {
			loading.value = false
		}
	}

	return {
		movieClubs,
		seasonAttendance,
		allTimeAttendance,
		loading,
		error,
		sortedMovieClubs,
		fetchMovieClubs,
		fetchAttendance
	}
})