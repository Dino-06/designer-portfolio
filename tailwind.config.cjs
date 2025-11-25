/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: Scans all HTML, JS, JSX, TSX files for utility classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sets the clean 'Inter' font globally
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}