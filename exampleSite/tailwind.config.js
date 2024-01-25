/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./hugo_stats.json", "./layouts/**/*.html", "./themes/ryder/layouts/**/*.html"],
  content: ["../layouts/**/*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'hidden-home': " url('/images/maui-sunset.webp')",
      },},
  },
  plugins: [require("@tailwindcss/typography")],
}

