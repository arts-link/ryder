# Changelog

All notable changes to the Ryder Hugo theme are documented in this file.

## v0.2.5

- **2.7** — Make the page shell configurable and hookable. `<body>`'s classes
  now come from `[params.twClasses] body` and `bodyDark` instead of being
  hardcoded in `baseof.html`; the wrapper `<div>` gains a stable `site-shell`
  class with `position: relative`; and the dev-only `tw-size-indicator` partial
  moves inside that wrapper, so `<body>` has exactly one element child in every
  environment. `bodyDark` is separate from `body` so that customizing the body
  font cannot silently disable dark mode, and so `darkMode = "off"` still emits
  no `dark:` variants (unchanged from v0.2.4).
- **4.1** — Ship `ryderTrack`, an `Alpine.data()` component that reads
  `data-track-event` / `data-track-props` off the clicked element and forwards
  them to the configured analytics provider (PostHog or Plausible). Missing
  providers no-op and malformed props warn and degrade to `{}` — neither breaks
  the handler.
- **4.2** — Ship `ryderForm`, an `Alpine.data()` component that POSTs a form as
  JSON to `data-form-action`, exposes `status` plus `isIdle`/`isLoading`/
  `isSuccess`/`isError`, honors a `_gotcha` honeypot, and fires an optional
  `data-track-event` on success.
- **4.4** — Add `assets/js/cspLint.js`, a development-only linter that warns in
  the console about Alpine directives the CSP evaluator cannot run — references
  to browser globals, and arrow functions — naming the offending element. It is
  never loaded outside `hugo.Environment == "development"`.
- **4.5** — Document the CSP-Alpine restriction in `README.md`, along with both
  new components and `assets/js/extended.js`, the theme's sanctioned custom-JS
  hook, which was previously undocumented.
- **2.1** — Ship `_default/list-plain.html` (title + `.Content`, no
  pagination/card grid) for data-driven singleton sections, selected via
  Hugo's own `layout` front-matter field; ship `partials/utils/data-items.html`,
  a returning partial for the `.Site.Data.<name>.items | default slice` idiom.
- **2.3** — Widen the OG image resolver with a front-matter `og_image` escape
  hatch, checked before the existing bundle-resource / `og_image_default`
  chain (which is otherwise unchanged).
- **2.4** — Support `hideIfEmptyData` under `[menus.<id>.params]`, naming a
  `data/*.json` file whose `items` array must be non-empty for that menu
  entry to render.
- **2.5** — Resolve a page-overridable `navClass` (or `twClasses.nav`) in
  `header.html` and pass it into the menu partial, so a single page can
  restyle just the nav without forking `header.html` into a new `headerType`
  variant. Documented as the "one variant plus `.Param` for the skin"
  pattern.
- **5.1** — Ship `youtube-embed` and `spotify-embed` shortcodes, following
  the `soundcloud`/`openstreetmap` pattern of auto-registering their iframe
  host in CSP `frame-src`. Named distinctly from Hugo's built-in `youtube`
  shortcode rather than overriding it.
- **5.2** — Add a `video-lightbox` shortcode and a `videoLightbox`
  `Alpine.data()` component beside the existing `imageGallery` (images
  only); the iframe's `src` is only set once the modal opens.
- **5.3** — `utils/socialslist.html` now accepts a flat name → URL map (what
  Decap CMS emits) in addition to the original `{main:[...]}` shape, and
  ships inline SVGs for Instagram, TikTok, Apple Music, Tidal, and Spotify
  for entries with no `icon` field, rather than widening the tree-shaken
  Font Awesome brand set.
- **5.4** — Add `logo_wrapperClass`; the wrapper chrome (background, hover
  state, padding) around the logo is now dropped automatically once
  `logo_png` is set. `logo_png`'s `.Param` (page-overridable) contract is
  documented as authoritative.
- **5.5** — Parameterize `head/favicon.html` via `[params.favicon]` (`ico`,
  `version`, `svg`, `appleTouchIcon`, `webmanifest`), each defaulting to a
  file the theme already ships.
- **5.6** — `_default/home.html` now reads `showHomeFeed` via `.Param`
  instead of `site.Params`, so a page-level override (e.g. a cascade) is
  honored instead of being a silent no-op.
- **Issue #3 (partial)** — Add `[params.fonts]` (`family`,
  `googleFontsFamily`, `disableGoogleFonts`), covering `head/fonts.html`'s
  Google Fonts URL and a new `--ryder-font-family` CSS custom property that
  `assets/css/main.css`'s `.resp-sharing-button` rule now reads. Does not
  close issue #3 — see `docs/specs/v0.3.md`'s cross-check for what remains.

### Breaking

None. Everything above is additive or opt-in.

### Migration note — 2.7 changes the DOM around `<body>`

Two structural changes ship in 2.7. Neither changes rendered output on a stock
site, but both can affect a site with its own CSS. **Grep your CSS for `body >`
before upgrading.**

1. **The wrapper `<div>` is now `position: relative`.** It was unpositioned, so
   it did not establish a containing block. Any `position: absolute` descendant
   that was previously resolving against the viewport (or against some further
   ancestor) now resolves against the shell instead, and may move. Audit
   absolutely-positioned elements, particularly full-bleed and off-canvas
   elements that relied on `inset-0` reaching the viewport.

2. **`tw-size-indicator` moved inside the wrapper.** In non-production builds it
   used to render as a sibling of the wrapper, so `<body>` had two element
   children in development and one in production. Any selector written against
   `<body>`'s direct children — `body > div`, `body > *:first-child`,
   `:nth-child()` on that level, or a `:not()` hack written to skip the
   indicator — was already environment-dependent and will now behave
   differently.

   The known real-world case is a rule of the shape:

   ```css
   body:has(.some-nav) > div:not(.fixed) { position: relative; }
   ```

   That rule exists only to select the wrapper while skipping the dev-only
   indicator. It can now be deleted outright: the theme provides both the hook
   and the positioning.

   ```css
   /* replace the above with nothing, or target the hook directly */
   .site-shell { … }
   ```

If you override `layouts/_default/baseof.html` in your own site, your copy
shadows the theme's and none of this applies until you re-sync it — which also
means you will not get `twClasses.body` or `site-shell` until you do.

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
