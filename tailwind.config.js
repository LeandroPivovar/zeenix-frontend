/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zenix-bg': '#0B0B0B',
        'zenix-card': '#0E0E0E',
        'zenix-green': '#22C55E',
        'zenix-green-hover': '#16A34A',
        'zenix-text': '#DFDFDF',
        'zenix-secondary': '#AAAAAA',
        'zenix-border': '#1C1C1C',
        'zenix-blue': '#0099FF',
        'zenix-yellow': '#FFD058',
        'zenix-red': '#FF4747'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

