/**
 * exampleSite's Tailwind config — the reference implementation of the consumer
 * pattern described in README > CSS Development.
 *
 * A site requires the theme's PRESET (design tokens) and declares its OWN
 * content globs, because content paths resolve from the site's project root
 * and the theme cannot know them.
 *
 * The require path below is `../tailwind.preset.js` only because exampleSite
 * lives inside the theme repository and reaches the theme via
 * `themesDir = "../../"`. In a normal site the theme is a submodule, so the
 * path is:
 *
 *   presets: [require('./themes/ryder/tailwind.preset.js')],
 *
 * Do NOT require the theme's tailwind.config.js — its globs are written for
 * the theme repo's own directory layout and match nothing from a site root.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  presets: [require("../tailwind.preset.js")],
  content: [
    "./hugo_stats.json",
    "./layouts/**/*.html",
    "./config/**/*.toml",
    "./content/**/*.md",
    "./../layouts/**/*.html",
  ],
};
