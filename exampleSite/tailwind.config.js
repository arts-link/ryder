/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./hugo_stats.json",
    "./layouts/**/*.html",
    "./config/**/*.toml",
    "./content/**/*.md",
    "./../../themes/ryder/layouts/**/*.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "hidden-home": " url('/ryder/images/hidden-home-cover.webp')",
        "header-sunset-mb": " url('/ryder/images/hidden-home-cover.webp')",
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
