<template>
	<canvas ref="chartRef"></canvas>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
	data: {
		labels: string[]
		datasets: Array<{
			data: number[]
			backgroundColor: string[]
		}>
	}
	options?: any
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

onMounted(() => {
	if (chartRef.value) {
		chart = new Chart(chartRef.value, {
			type: 'doughnut',
			data: props.data,
			options: props.options
		})
	}
})

watch(() => props.data, (newData) => {
	if (chart) {
		chart.data = newData
		chart.update()
	}
}, {deep: true})
</script>