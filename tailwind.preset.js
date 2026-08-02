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
      colors: {
        // Semantic color tokens. Every value resolves through a CSS custom
        // property so a site can repoint the palette without forking the
        // preset -- see head/colors.html and README > Color tokens.
        //
        // Channels, not hex: a hex inside var() works for text-/bg-/border-
        // but silently breaks every opacity modifier, and the theme leans on
        // those (border-ryder-accent-300/80, dark:bg-ryder-accent-950/40, the
        // share-button fills at /88). Space-separated RGB channels interpolate
        // with <alpha-value> and keep the modifiers working.
        //
        // Each family carries a full 50-950 ramp so migrating the theme's own
        // classes is a pure rename with no visual change, and the ramp step
        // matching the family's canonical shade resolves through the headline
        // token (--ryder-brand-800 -> var(--ryder-brand)); setting just
        // --ryder-brand therefore moves both `ryder-brand` and
        // `ryder-brand-800`. assets/css/main.css holds the default values.
        ryder: {
          brand: {
            DEFAULT: "rgb(var(--ryder-brand) / <alpha-value>)",
            50: "rgb(var(--ryder-brand-50) / <alpha-value>)",
            100: "rgb(var(--ryder-brand-100) / <alpha-value>)",
            200: "rgb(var(--ryder-brand-200) / <alpha-value>)",
            300: "rgb(var(--ryder-brand-300) / <alpha-value>)",
            400: "rgb(var(--ryder-brand-400) / <alpha-value>)",
            500: "rgb(var(--ryder-brand-500) / <alpha-value>)",
            600: "rgb(var(--ryder-brand-600) / <alpha-value>)",
            700: "rgb(var(--ryder-brand-700) / <alpha-value>)",
            800: "rgb(var(--ryder-brand-800) / <alpha-value>)",
            900: "rgb(var(--ryder-brand-900) / <alpha-value>)",
            950: "rgb(var(--ryder-brand-950) / <alpha-value>)",
          },
          "brand-alt": {
            DEFAULT: "rgb(var(--ryder-brand-alt) / <alpha-value>)",
            50: "rgb(var(--ryder-brand-alt-50) / <alpha-value>)",
            100: "rgb(var(--ryder-brand-alt-100) / <alpha-value>)",
            200: "rgb(var(--ryder-brand-alt-200) / <alpha-value>)",
            300: "rgb(var(--ryder-brand-alt-300) / <alpha-value>)",
            400: "rgb(var(--ryder-brand-alt-400) / <alpha-value>)",
            500: "rgb(var(--ryder-brand-alt-500) / <alpha-value>)",
            600: "rgb(var(--ryder-brand-alt-600) / <alpha-value>)",
            700: "rgb(var(--ryder-brand-alt-700) / <alpha-value>)",
            800: "rgb(var(--ryder-brand-alt-800) / <alpha-value>)",
            900: "rgb(var(--ryder-brand-alt-900) / <alpha-value>)",
            950: "rgb(var(--ryder-brand-alt-950) / <alpha-value>)",
          },
          accent: {
            DEFAULT: "rgb(var(--ryder-accent) / <alpha-value>)",
            50: "rgb(var(--ryder-accent-50) / <alpha-value>)",
            100: "rgb(var(--ryder-accent-100) / <alpha-value>)",
            200: "rgb(var(--ryder-accent-200) / <alpha-value>)",
            300: "rgb(var(--ryder-accent-300) / <alpha-value>)",
            400: "rgb(var(--ryder-accent-400) / <alpha-value>)",
            500: "rgb(var(--ryder-accent-500) / <alpha-value>)",
            600: "rgb(var(--ryder-accent-600) / <alpha-value>)",
            700: "rgb(var(--ryder-accent-700) / <alpha-value>)",
            800: "rgb(var(--ryder-accent-800) / <alpha-value>)",
            900: "rgb(var(--ryder-accent-900) / <alpha-value>)",
            950: "rgb(var(--ryder-accent-950) / <alpha-value>)",
          },
          "chrome-from": "rgb(var(--ryder-chrome-from) / <alpha-value>)",
          "chrome-to": "rgb(var(--ryder-chrome-to) / <alpha-value>)",
        },
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
