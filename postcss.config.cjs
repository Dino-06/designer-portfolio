module.exports = {
  plugins: {
    // FIX for Vercel build error: Uses the explicit PostCSS plugin
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
  },
}