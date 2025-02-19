import {ChartOptions} from 'chart.js'

export function useChartConfig() {
	const chartOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'right',
				labels: {
					color: 'white',
					font: {
						size: 12
					}
				}
			},
			tooltip: {
				callbacks: {
					label: (context: any) => {
						const label = context.label || ''
						const value = context.raw || 0
						return `${label}: ${value} attendances`
					}
				}
			}
		}
	}

	const generateChartColors = (count: number) => {
		const colors = [
			'#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
			'#9966FF', '#FF9F40', '#7FBA00', '#00A4EF',
			'#F25022', '#8E44AD', '#2ECC71', '#E67E22'
		]
		return Array(count).fill(0).map((_, i) => colors[i % colors.length])
	}

	return {
		chartOptions,
		generateChartColors
	}
}