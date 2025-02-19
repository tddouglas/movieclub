<template>
	<div class="pt-20 px-4">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-4xl font-bold mb-8">Club History</h1>

			<!-- Attendance Charts -->
			<div class="grid md:grid-cols-2 gap-8 mb-12">
				<AttendanceChart
					title="This Season's Attendance"
					:attendance="seasonAttendance"
				/>
				<AttendanceChart
					title="All Time Attendance"
					:attendance="allTimeAttendance"
				/>
			</div>

			<!-- Movie Club History -->
			<div class="space-y-4">
				<div v-for="club in sortedMovieClubs" :key="club.id" class="bg-gray-800 rounded-lg">
					<button
						@click="toggleExpanded(club.id)"
						class="w-full p-6 text-left flex justify-between items-center"
					>
            <span class="text-xl font-semibold">
              {{ new Date(club.date).toLocaleDateString() }}
            </span>
						<span class="transform transition-transform" :class="{
              'rotate-180': expandedClub === club.id
            }">▼</span>
					</button>

					<div v-if="expandedClub === club.id" class="p-6 pt-0 border-t border-gray-700">
						<h3 class="text-lg font-semibold mb-4">
							Winning Movie: {{ club.winningMovie.title }}
						</h3>

						<div class="space-y-2">
							<div v-for="option in club.options" :key="option.title" class="flex justify-between">
								<span>{{ option.title }}</span>
								<span>{{ option.votes }} votes</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useMovieClubStore} from '@/stores/movieClub'
import AttendanceChart from '@/components/charts/AttendanceChart.vue'

const movieClubStore = useMovieClubStore()
const {seasonAttendance, allTimeAttendance, sortedMovieClubs} = storeToRefs(movieClubStore)
const expandedClub = ref<string | null>(null)

const toggleExpanded = (clubId: string) => {
	expandedClub.value = expandedClub.value === clubId ? null : clubId
}

onMounted(async () => {
	await Promise.all([
		movieClubStore.fetchMovieClubs(),
		movieClubStore.fetchAttendance()
	])

	if (sortedMovieClubs.value.length > 0) {
		expandedClub.value = sortedMovieClubs.value[0].id
	}
})
</script>