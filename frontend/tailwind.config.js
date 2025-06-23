/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          500: '#2E7D32',
          600: '#1B5E20',
          700: '#1B5E20',
        },
        secondary: {
          400: '#81C784',
          500: '#66BB6A',
        },
        accent: {
          400: '#FFB300',
        },
        status: {
          red: '#E53935',
          green: '#66BB6A',
        }
      }
    },
  },
  plugins: [],
}