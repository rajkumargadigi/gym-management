/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gymRed: {
          light: '#ff4d4d',
          DEFAULT: '#dc2626',
          dark: '#991b1b',
        },
        gymBlack: {
          light: '#1f1f1f',
          DEFAULT: '#121212',
          dark: '#0a0a0a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
