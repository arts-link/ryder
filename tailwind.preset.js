/**
 * Ryder's Tailwind preset — the theme's design tokens, and nothing else.
 *
 * This carries `theme`, `darkMode`, and `plugins`. It deliberately does NOT
 * carry `content`: content globs are relative to the directory Tailwind is
 * invoked from, which for a consuming site is that site's project root, not
 * `themes/ryder/`. A theme cannot know those paths, so each site declares its
 * own. See tailwind.config.js in this repo for the theme's own dev globs, and
 * README > CSS Development for the consumer pattern.
 *
 * Use it from your site's tailwind.config.js:
 *
 *   module.exports = {
 *     presets: [require('./themes/ryder/tailwind.preset.js')],
 *     content: [
 *       './themes/ryder/layouts/ ** / *.html',
 *       './layouts/ ** / *.html',
 *       './content/ ** / *.md',
 *       './hugo_stats.json',
 *     ],
 *   };
 *
 * Anything you add under `theme.extend` in your own config merges on top of
 * this; anything you set under `theme` directly replaces the key.
 *
 * @type {import('tailwindcss').Config}
 */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "hidden-home": " url('/images/hidden-home-cover.webp')",
        "header-sunset": " url('/images/header-bg/sunset-playa-1.jpg')",
        "header-sunset-italy": " url('/images/header-bg/sunset-italy.jpg')",
        "header-sunset-mb":
          " url('/images/header-bg/sunset-mission-bay_hu6f04b8530673b6e2cc009e9b6d51ea4d_1824404_1024x768_resize_q100_h2_box.webp')",
      },
      fontFamily: {
        // Resolves through --ryder-font-family so that `font-titillium` — the
        // class baseof.html puts on <body> by default — follows
        // [params.fonts] family instead of contradicting it. head/fonts.html
        // sets the custom property when a site configures params.fonts.family;
        // the literal below is the fallback when it does not, which keeps the
        // theme's own default unchanged. assets/css/main.css reads the same
        // property for .resp-sharing-button. (Issue #3, configurable fonts.)
        titillium: [
          'var(--ryder-font-family, "Titillium Web")',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      screens: {
        xs: "475px",
        ...defaultTheme.screens,
        "3xl": "1600px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
