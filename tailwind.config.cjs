/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			screens: {
				xs: '450px',
			},
			colors: {
				primary: '#0092CA',
				secondary: '#145374',
				action: '#1F6CB0 ',
				bg: '#121212',
				layer: '#1A1A1A',
				layer2: '#222',
				layer3: '#333',
				text: '#fff',
			},
		},
	},
	plugins: [],
};
