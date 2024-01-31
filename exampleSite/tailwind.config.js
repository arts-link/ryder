/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./hugo_stats.json", 
    "./config/**/*.toml",
    "./layouts/**/*.html",
    "./../layouts/**/*.html", 
    "./themes/ryder/layouts/**/*.html", 
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'hidden-home': " url('../images/hidden-home-cover.webp')",
      },},
  },
  plugins: [require("@tailwindcss/typography")],
}

