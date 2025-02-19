<template>
	<div class="bg-gray-800 rounded-lg p-6">
		<h2 class="text-2xl font-semibold mb-4">{{ title }}</h2>
		<div class="h-64">
			<DoughnutChart
				v-if="attendance.length"
				:data="chartData"
				:options="chartOptions"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import DoughnutChart from './DoughnutChart.vue'
import {useChartConfig} from '@/composables/useChartConfig'
import type {Attendance} from '@/api/types'

const props = defineProps<{
	title: string
	attendance: Attendance[]
}>()

const {chartOptions, generateChartColors} = useChartConfig()

const chartData = computed(() => ({
	labels: props.attendance.map(a => a.memberName),
	datasets: [{
		data: props.attendance.map(a => a.count),
		backgroundColor: generateChartColors(props.attendance.length)
	}]
}))
</script>