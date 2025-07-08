
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
        pastel: {
          green: '#C1E1C1', // Pastel green
          blue: '#C1E1E1',  // Pastel blue
          yellow: '#FFF9C4', // Pastel yellow
          pink: '#F8C8DC',  // Pastel pink
          purple: '#D8BFD8', // Pastel purple
          gray: '#E0E0E0',  // Light gray
          red: '#FFB6B6',   // Pastel red
          orange: '#FFDAB9', // Pastel orange
        },
        dashboard: {
          bg: '#F5F7FA',    // Light background
          card: '#FFFFFF',  // Card background
          border: '#E2E8F0', // Border color
          text: {
            primary: '#334155',   // Dark text
            secondary: '#64748B', // Medium text
            light: '#94A3B8',    // Light text
          }
        }
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'hero-pattern': "url('./src/Assets/bg.jpg')",
      },
    },
  },
  plugins: [],
}
