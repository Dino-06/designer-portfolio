/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: This tells Tailwind where to scan for CSS classes (all HTML, JS, JSX, TSX files)
  content: [
    "./index.css",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Defines the clean 'Inter' font as the default sans-serif font
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}