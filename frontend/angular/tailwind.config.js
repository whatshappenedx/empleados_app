/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // New palette: FF6700, EBEBEB, C0C0C0, 3A6EA5, 004E98
          darkest: '#004E98', // deep blue
          dark: '#3A6EA5',    // mid blue
          mid: '#C0C0C0',     // neutral mid (borders/lines)
          accent: '#FF6700',  // accent orange
          light: '#EBEBEB'    // light background
        }
      }
    }
  },
  plugins: [],
}
