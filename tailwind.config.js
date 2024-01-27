/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hidden-home': " url('/images/hidden-home-cover.webp')",
      },},
  },
  plugins: [require("@tailwindcss/typography")],
}

