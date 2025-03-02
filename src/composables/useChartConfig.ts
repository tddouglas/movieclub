import {ChartOptions} from 'chart.js'

export function useChartConfig(chartTitle: string) {
	const chartOptions: ChartOptions = {
		indexAxis: 'y', // Horizontal bars
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: true,
				text: chartTitle,
				font: {weight: 'bold', size: 15},
				padding: {bottom: 15}
			},
			legend: {
				display: false,
				labels: {
					boxWidth: 10
				}
			}
		},
		scales: {
			x: {
				stacked: true,
				title: {
					display: true,
					text: 'Number of Movies'
				},
				ticks: {
					stepSize: 1
				}
			},
			y: {
				stacked: true,
				title: {
					display: false
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

	// Hardcoded data for testing
	const hardcodedChartJsData = () => {
		return {
			labels: ['Tyler', 'Caleb', 'Nikhil', 'Shannah', 'David', 'Shosh'], // would need to be sorted person list
			// Dataset structure takes an object with label = Movie title and data = array of parent labels index where data[n] = provide data[n] point to the person for position labels[n]
			datasets: [
				{
					label: 'Banchees',
					data: [1, 1, 0, 1, 0, 0]
				},
				{
					label: 'Nope',
					data: [1, 1, 1, 0, 0, 1]
				},
				{
					label: 'The Worst Person in the World',
					data: [1, 0, 0, 1, 1, 1]
				}
			]
		}
	}

	return {
		chartOptions,
		generateChartColors,
		hardcodedChartJsData
	}
}