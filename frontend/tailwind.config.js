/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farmio: {
          light: '#8CC084', // Light green
          DEFAULT: '#5DA94E', // Medium green (primary)
          dark: '#3B7A2E', // Dark green
        },
      },
    },
  },
  plugins: [],
}
