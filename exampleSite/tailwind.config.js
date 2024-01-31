/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./hugo_stats.json", "./layouts/**/*.html", "./themes/ryder/layouts/**/*.html"],
  content: [
    "./hugo_stats.json", 
    "./config/**/*.toml",
    "./layouts/**/*.html",
    "./../layouts/**/*.html", 
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        // change for github hosting...
        // 'hidden-home': " url('/ryder/images/hidden-home-cover.webp')",
        'hidden-home': " url('../images/hidden-home-cover.webp')",
      },},
  },
  plugins: [require("@tailwindcss/typography")],
}

