/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		colors: {
			primary: '#47B5FF',
			secondary: '#256D85',
			action: '#06283D',
			bg: '#121212',
			layer: '#222',
			text: '#fff',
		},
		extend: {
			screens: {
				xs: '450px',
			},
		},
	},
	plugins: [],
};
