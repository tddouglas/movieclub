<template>
	<div class="relative">
		<div class="absolute w-8 -top-1 right-0 z-10" @click="toggleExpand">
			<transition
				mode="out-in"
				enter-active-class="transition-opacity duration-400"
				leave-active-class="transition-opacity duration-400"
				enter-from-class="opacity-0"
				leave-to-class="opacity-0"
			>
				<img :src="expanded ? collapseImage : expandImage" alt="Expand" :key="expanded.toString()"
					 class="cursor-pointer transition transform duration-300 hover:scale-125">
			</transition>
		</div>
		<div class="h-96 overflow-y-scroll">
			<div class="relative" :style="{height: chartHeight}">
				<canvas ref="canvas"></canvas>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch, computed} from 'vue'
import {Chart, registerables, ChartOptions} from 'chart.js'
import {useChartConfig} from '@/composables/useChartConfig.ts'
import expandImage from '@/assets/expand.svg'
import collapseImage from '@/assets/collapse.svg'
import type {ChartDataObject} from "@/components/charts/chartTypes.ts"

// Register Chart.js components
Chart.register(...registerables)

/*––– Props and Emits –––*/
const emit = defineEmits(['expandChart'])
const props = defineProps<{
	chartData: ChartDataObject | undefined,
	chartTitle: string
}>()

/*––– Refs and State –––*/
const {chartOptions} = useChartConfig(props.chartTitle)
const canvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const expanded = ref<boolean>(false)
const toggleExpand = (): void => {
	expanded.value = !expanded.value
	emit('expandChart')
}

const chartHeight = computed(() => {
	if (props.chartData) {
		const height = Math.max((props.chartData.labels.length * 60), 350)
		return `${height.toString()}px`
	} else {
		return "200px"
	}
})

/*––– Chart.js Setup and Click Handling –––*/
const renderChart = () => {
	if (canvas.value && props.chartData) {
		const ctx = canvas.value.getContext('2d')
		if (ctx) {
			chartInstance = new Chart(ctx, {
				type: 'bar',
				data: props.chartData,
				options: chartOptions
			})
		}
	}
}

onMounted(async () => {
	if (props.chartData !== undefined) {
		renderChart()
	}
})

// Update the chart when displayed data changes
watch(() => props.chartData, () => {
	if (props.chartData !== undefined) {
		if (!chartInstance) {
			renderChart()
		} else {
			chartInstance.data = props.chartData
			chartInstance.update()
		}
	}
})

// Clean up the Chart.js instance on unmount
onBeforeUnmount(() => {
	if (chartInstance) {
		chartInstance.destroy()
	}
})
</script>
