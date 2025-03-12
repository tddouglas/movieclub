/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: '#646cff',
				secondary: '#535bf2',
				black50: 'rgba(0, 0, 0, 0.5)',
			},
			textColor: {
				main: 'rgba(255, 255, 255, 1)',
				subtext: 'rgba(209, 213, 219, 1)',
				dark: 'rgba(17, 24, 39, 1)'
			},
			backgroundColor: {
				main: 'rgba(17, 24, 39, 1)',
				darkerMain: 'rgba(9, 12, 20, 1)',
				gray: 'rgba(55, 65, 81, 1)',
				navbar: 'rgba(0, 0, 0, 0.85)'
			}
		},
	},
	plugins: [],
}