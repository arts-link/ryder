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
        "header-ryder": " url('/ryder/images/ryder-theme-og.webp')",
      },
      fontFamily: {
        titillium: ["Titillium Web", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1280',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
