/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'background': '#171a21',
        'teal': '#66c0f4',
        'primary-1': '#1b2838',
        'primary-2': '#2a475e',
        'primary-3': '#c7d5e0'
      }
    },
  },
  plugins: [],
}