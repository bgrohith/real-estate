/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#c5dbfe',
          300: '#9bc2fd',
          400: '#69a0f9',
          500: '#437ff4',
          600: '#255fe8',
          700: '#1b49d4',
          800: '#183cab',
          900: '#0f296b',
          950: '#091845',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'sapphire': '0 10px 30px -5px rgba(27, 73, 212, 0.15)',
        'luxury': '0 20px 40px -15px rgba(15, 41, 107, 0.2)',
      }
    },
  },
  plugins: [],
}
