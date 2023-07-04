/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				fadeUP1: "fadeUP .5s forwards",
			},
			keyframes: {
				fadeUP: {
					"0%": { transform: "translateY(2rem)", opacity: "0" },
					"100%": { transform: "translateY(0rem)", opacity: "1" },
				},
			},
		},
	},
	plugins: [],
};
