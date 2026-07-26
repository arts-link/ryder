# Changelog

All notable changes to the Ryder Hugo theme are documented in this file.

## v0.2.4

Tier 1 fixes from the v0.3 upstream change spec — silent failures and defects,
none of them breaking. See each item's number in the spec for full detail and
evidence.

- **1.1** — Document the `[security.funcs] getenv` requirement for
  `PUBLIC_POSTHOG_*` env vars, add the (commented) block to `exampleSite`, and
  warn at build time when PostHog is selected but no key can be found from
  either params or a blocked/unset environment variable.
- **1.2** — Remove the JavaScript comments emitted inside
  `<script type="application/ld+json">` blocks in `head/schema.html`, which
  made every affected block fail to parse as JSON.
- **1.3** — Normalize a leading slash off `og_image_default`, wrap the
  `resources.Get` lookup in `with`, and `errorf` naming the offending param
  and value on a miss, instead of a nil-pointer panic. Document
  `og_image_default` as `assets/`-relative only, and note that extended Hugo
  is required whenever any OG/processed image is WebP.
- **1.4** — Guard `footer.html`'s unguarded `.Site.Params.footer.tagCloud`
  reads with `.Param "footer.tagCloud"`, so a site with no `[params.footer]`
  block builds.
- **1.5** — Add `params.darkMode` (`"toggle"` / `"system"` / `"off"`) with a
  non-regressing default mapping from the legacy `showDarkToggle` param, so
  `"off"` skips `themeBoot.js`, the theme switcher, and the `dark:` Tailwind
  variants on `<body>` — while every existing site renders identically until
  it opts in.
- **1.6** — Auto-register embed iframe hosts (`soundcloud`, `openstreetmap`)
  on the page store and fold them into CSP `frame-src`; add a
  `params.csp.embeds` preset for hosts the theme can't auto-detect (Hugo's
  built-in `youtube`/`vimeo` shortcodes); fix `exampleSite`'s CSP config,
  which was missing the uMap host for its own `openstreetmap` demo.
- **1.7** — Declare the theme's runtime JS dependencies
  (`@alpinejs/csp`, `@alpinejs/focus`, `leaflet`, the Font Awesome packages)
  in the theme's own `package.json`, and warn (not error) in `head/js.html`
  when a consuming site hasn't installed them at its project root — which is
  where `js.Build` actually resolves them from.
- **1.8** — Move `[build] writeStats` and the three `[[build.cachebusters]]`
  rules from `exampleSite` into the theme's own `hugo.toml`, so every
  consumer inherits `hugo_stats.json` generation and dev-server cachebusting
  (a site's own `[build]` block still wins).
- **1.9** — Correct `REWRITE.md`'s stale claims that `header-fun.html` and
  `footer-fun.html` exist: they were created, then removed nine days later as
  collateral in an unrelated refactor, and the log was never updated. Reword
  the Phase 5 deferral and note the removal instead of silently rewriting
  history.
- **2.6** — Guard `baseof.html`'s `headerType`/`footerType` variant dispatch
  (and `header.html`'s `menuType` dispatch) with `templates.Exists`, `warnf`
  the param name and resolved partial on a miss, and fall back to the base
  variant instead of failing the build with a cryptic error. This is also
  what makes 1.9's class of bug self-reporting going forward.

### Breaking

None.
