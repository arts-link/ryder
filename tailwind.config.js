/**
 * Tailwind config for THIS REPOSITORY's own builds — the theme's dev loop and
 * exampleSite. It is a thin wrapper: every design token lives in
 * tailwind.preset.js, and only the `content` globs below are local to this
 * repo's layout on disk.
 *
 * A consuming site should NOT require this file. Its globs resolve from this
 * repo's root, so from a site's project root they point at nothing —
 * `./exampleSite/...` does not exist there, and `./themes/ryder/layouts/...`
 * would mean `themes/ryder/themes/ryder/layouts/...`. Tailwind then finds no
 * classes and silently emits an almost-empty stylesheet.
 *
 * Require tailwind.preset.js instead and declare your own content globs. See
 * README > CSS Development.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  presets: [require("./tailwind.preset.js")],
  content: [
    "./hugo_stats.json",
    "./exampleSite/hugo_stats.json",
    "./layouts/**/*.html",
    "./config/**/*.toml",
    "./exampleSite/config/**/*.toml",
    "./exampleSite/layouts/**/*.html",
    "./content/**/*.md",
    "./exampleSite/content/**/*.md",
  ],
};
