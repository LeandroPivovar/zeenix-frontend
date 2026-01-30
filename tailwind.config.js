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
        'zenix-secondary': '#A1A1A1',
        'zenix-label': '#7A7A7A',
        'zenix-border': '#1C1C1C',
        'zenix-divider': '#1A1A1A',
        'zenix-blue': '#0099FF',
        'zenix-yellow': '#FFD058',
        'zenix-red': '#FF4747',
        // Standard aliases for the new design
        'success': '#22C55E',
        'secondary': '#141414',
        'foreground': '#DFDFDF',
        'muted-foreground': '#7A7A7A',
        'border': '#1C1C1C',
        'success-foreground': '#FFFFFF'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

