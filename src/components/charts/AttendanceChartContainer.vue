<template>
	<div class="flex flex-col md:flex-row items-center mt-4 md:p-20">
		<section v-if="expandedChart === null || expandedChart === 'left'"
				 :class="[expandedChart === 'left' ? 'w-full' : 'w-11/12 md:w-1/2 md:mr-4',
				 'mb-4 transition-all duration-500 ease-in-out']">
			<CardBox>
				<StackedBarChart :chartData="currentSeasonAttendance" :chart-title="'Season 4 Attendance'"
								 @expandChart="handleExpandChart('left')"/>
			</CardBox>
		</section>
		<section v-if="expandedChart === null || expandedChart === 'right'"
				 :class="[expandedChart === 'right' ? 'w-full ml-auto' : 'w-11/12 md:w-1/2 md:ml-auto',
				 'mb-4 transition-all duration-500 ease-in-out']">
			<CardBox>
				<StackedBarChart :chartData="lifetimeAttendance" :chart-title="'Lifetime Attendance'"
								 @expandChart="handleExpandChart('right')"/>
			</CardBox>
		</section>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {supabase} from '@/database/supabaseClient'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'
import CardBox from '@/components/CardBox.vue'
import type {AttendanceObject, ChartDataObject} from "@/components/charts/chartTypes.ts"
import {validateEntry} from "@/components/charts/chartTypes.ts"

/*––– Types –––*/
type ChartId = 'left' | 'right'

/*––– State –––*/
const lifetimeAttendance = ref<ChartDataObject>()
const currentSeasonAttendance = ref<ChartDataObject>()
const currentSeasonId = ref<string | null>(null)
const expandedChart = ref<ChartId | null>(null)  // null means no chart is expanded; 'left' or 'right' indicates which one is expanded

const handleExpandChart = (chartId: ChartId) => {
	console.log("Chart expansion caught", chartId)
	if (expandedChart.value === chartId) {
		expandedChart.value = null
	} else {
		expandedChart.value = chartId
	}
}

/*––– Data Fetching –––*/
const fetchData = async () => {
	// Query current season (where end_date is null)
	const {data: seasonData} = await supabase
		.from('seasons')
		.select('id')
		.is('end_date', null)
		.single()
		.throwOnError()

	currentSeasonId.value = seasonData.id

	// Query all attendance records
	const {data: attendanceData} = await supabase
		.from('get_all_attendance')
		.select('*')
		.throwOnError()

	const validatedAttendanceData: AttendanceObject[] = attendanceData.map(validateEntry);
	const lifetime_chart_data = formatMovieData(validatedAttendanceData);
	const current_season_chart_data = formatMovieData(validatedAttendanceData, currentSeasonId.value)
	// console.log(lifetime_chart_data)
	lifetimeAttendance.value = lifetime_chart_data
	currentSeasonAttendance.value = current_season_chart_data

}

function formatMovieData(data: AttendanceObject[], seasonId?: string): ChartDataObject {
	// Filter the data if a seasonId is provided.
	const filteredData = seasonId
		? data.filter(entry => entry.season_id === seasonId)
		: data

	// Compute a count for each display name (total movies watched)
	const labelCounts = filteredData.reduce((acc: Record<string, number>, entry) => {
		acc[entry.display_name] = (acc[entry.display_name] || 0) + 1;
		return acc;
	}, {} as Record<string, number>)

	// Extract unique display names and sort them descending by total movies watched.
	const labels = Array.from(new Set(filteredData.map(entry => entry.display_name)))
		.sort((a, b) => labelCounts[b] - labelCounts[a])

	// Extract unique movie titles (options). If you want these sorted as well, you can do similar logic.
	const movieTitles = Array.from(new Set(filteredData.map(entry => entry.title)))

	// Build datasets for each movie title.
	// For each sorted label, we check if there's at least one attendance record for the current movie.
	const datasets = movieTitles.map(title => {
		const dataArray = labels.map(name =>
			filteredData.some(entry => entry.display_name === name && entry.title === title) ? 1 : 0
		);
		return {label: title, data: dataArray}
	});

	return {labels, datasets}
}

onMounted(async () => {
	await fetchData()
})
</script>
