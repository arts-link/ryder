/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // content: ['./hugo_stats.json'],

  content: [
    "'./hugo_stats.json'",
    "./layouts/**/*.html",
    "./config/**/*.toml",
    "./content/**/*.md",
    "./themes/benstraw/layouts/**/*.html",
    "./themes/ryder/layouts/**/*.html",
    "./themes/ryder-dev/layouts/**/*.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "hidden-home": " url('/images/hidden-home-cover.webp')",
        "header-sunset": " url('/images/header-bg/sunset-playa-1.jpg')",
        "header-sunset-italy": " url('/images/header-bg/sunset-italy.jpg')",
        // "header-sunset-mb": " url('/images/header-bg/sunset-mission-bay.jpg')",
        "header-sunset-mb": " url('/images/header-bg/sunset-mission-bay_hu6f04b8530673b6e2cc009e9b6d51ea4d_1824404_1024x768_resize_q100_h2_box.webp')",
      },
      fontFamily: {
        titillium: ["Titillium Web", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
        '3xl': '1600px',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
