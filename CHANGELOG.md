# Changelog

All notable changes to the Ryder Hugo theme are documented in this file.

## v0.3.1

- **Dependencies** — Update `jsdom` from 29.1.1 to 30.0.1 and the example
  site's `postcss` from 8.5.23 to 8.5.25.
- **CI** — Update `actions/deploy-pages` from v4 to v5,
  `actions/setup-node` from v6 to v7, and `actions/configure-pages` from v4 to
  v6.
- **Development** — Move the test workflow to Node.js 24 and declare the
  supported Node.js range required by `jsdom` 30.

## v0.3.0

The breaking release. Four breaking changes, listed under **Breaking** below
with what each one asks of you. Upgrade from v0.2.5, not from further back —
see `docs/specs/v0.3.md` for the staged path.

- **2.2** — `head/schema.html` is rebuilt to construct Hugo `dict`s and
  `jsonify` them instead of hand-writing JSON as template text. v0.2.4's item
  1.2 fixed that bug class by deleting three stray `//` comments; this removes
  the technique that made them possible. Along the way: the file's three
  different homepage tests (`eq .Title .Site.Title`, `.IsHome`,
  `ne .Title .Site.Title`) collapse to `.IsHome`; `articleBody`, which inlined
  the entire rendered page body into every `BlogPosting`, is gone; dates are
  emitted as RFC 3339 rather than Go's default time format; and breadcrumbs are
  separate script blocks instead of one conditionally-nested array.
- **2.2** — New `layouts/partials/head/schema-extra.html`, a no-op hook called
  from `head-seo.html` and shadowed from your own `layouts/`, mirroring
  `extend_head.html`. Add JSON-LD types without overriding `head/schema.html`,
  which silently drops every block the theme emits.
- **2.2** — New `params.schema.type` (default `"Organization"`) sets the
  site-wide entity on the home page, so `MusicGroup`, `Person`,
  `LocalBusiness`, etc. need no template override at all. `Person` receives an
  `image` rather than a `logo`, per schema.org.
- **2.2** — `head/schema-recipe.html` gets the same dict-based rewrite. It
  carried its own `// schema for recipes` comment inside the script tag, so
  the `Recipe` block never parsed either, and several comma-dependent
  emissions produced trailing commas when an optional field was unset or the
  last list entry was a `**` section header.
- **3.1** — New `tailwind.preset.js` carrying `theme`, `darkMode`, and
  `plugins`, and deliberately no `content`. `tailwind.config.js` becomes a thin
  wrapper holding only this repo's own dev globs. See **Breaking**.
- **3.1** — `fontFamily.titillium` now resolves through
  `var(--ryder-font-family, "Titillium Web")`, so the `font-titillium` class on
  `<body>` follows `[params.fonts]` instead of contradicting it. Third of the
  four hardcoded Titillium sites named in issue #3.
- **3.2** — `assets/css/style.css` is deleted. See **Breaking**.
- **3.3** — The `build-tw`, `watch-tw`, and `deploy-tw` npm scripts are
  deleted, and the README section that presented them as the build workflow is
  rewritten. See **Breaking**.
- **3.4** — Documented that a consuming site **must** declare `[outputs]`
  itself to get `llms.txt`. The v0.3 spec called the site's block a redundant
  duplicate on the grounds that theme config merges into the site's; that was
  tested against a scratch consumer and is false. `outputFormats` **is**
  inherited (so you need not redefine the `LLMSTxt` format), `outputs` is not.
  Deleting the block, as the spec advised, would have silently removed
  `llms.txt` from every Ryder site.
- **4.3** — PostHog's bootstrap is compiled with `resources.FromString |
  js.Build | fingerprint` and loaded via `src` + `integrity` instead of being
  inlined. See **Breaking**.
- **4.3** — New `params.csp.scriptSrcHashes`, a list of SHA-256 hashes for a
  site's own inline scripts. The policy ships as a `<meta http-equiv>` tag and
  a meta-delivered CSP cannot carry a nonce, so hashes are the only way to
  permit one inline script without permitting all of them.
- **Repo hygiene** — `hugo_stats.json` (root and `exampleSite/`) is now
  gitignored. It was tracked so that a clean build had a stats file to glob,
  but Hugo rewrites it on every build, so running `hugo server` dirtied the
  tree and aborted the next `git pull`. Measured cost of untracking it: on a
  cold clone the first CSS compile is missing 3 dynamically-assembled classes
  out of 726, all `resp-sharing-button` modifiers; every later build has them.
  Build twice if you produce release artifacts from a fresh clone.
- **exampleSite** — The recipe demo page declared `recipe = true` and every
  other recipe key *after* its `[menu]` table, so TOML absorbed them all into
  `menu.main`. `.Params.recipe` was nil: the page rendered "No ingredients
  listed." and emitted no `Recipe` JSON-LD at all. The theme's own reference
  implementation of the recipe feature had been dead. Fixed by moving `[menu]`
  last.
- **exampleSite** — `tailwind.config.js` converted to the consumer preset
  pattern it is meant to demonstrate; it had drifted a duplicate copy of the
  theme's tokens, missing the `xs` and `3xl` screens and with `'2xl': '1280'`
  missing its unit.
- **Tests** — New `tests/e2e/schema.spec.js` (8 cases) and
  `tests/e2e/csp.spec.js` (10 cases, including a production fixture build for
  the PostHog assertions the dev server cannot make).

### Breaking

**1. The `*-tw` npm scripts are deleted (3.3). This breaks build commands, not
rendering.** Any CI, Vercel, or Netlify command running
`npm run build-tw && hugo --minify` will now fail on a missing script.

*What to do:* drop the `npm run build-tw &&` half. Tailwind already compiles
inside the Hugo build via `head/css.html`'s `css.PostCSS`, so `hugo --minify`
alone is sufficient — and always was. Confirm `tailwindcss`, `postcss`,
`postcss-cli`, and `autoprefixer` are installed at your **project root** (not
in `themes/ryder/` — Hugo invokes PostCSS from your project root and consults
only that `node_modules`) alongside a `postcss.config.js`. If your docs
prescribe a two-terminal watch loop, delete that too; it was never required.

**2. `script-src` no longer carries `'unsafe-inline'` (4.3). This fails in the
visitor's browser, not in your build.** Before v0.3.0, enabling PostHog
appended `'unsafe-inline'` to `script-src` for the whole site, because the
bootstrap snippet was inline. Any inline `<script>` of your own was being
permitted by that side effect and will now be blocked. CSP violations do not
fail the build.

*What to do:* grep your templates for `<script>` without a `src`. For each,
either add its SHA-256 to the new `params.csp.scriptSrcHashes`, move the code
into `assets/js/extended.js` (bundled into `main.js`, needs no allowance), or
set `params.csp.scriptSrc = "'unsafe-inline'"` explicitly — the point of the
change is that widening becomes a decision rather than a default. Verify with
a production build and a browser console showing zero violations, not by
reading the config. `style-src` keeps its `'unsafe-inline'` deliberately;
Alpine's `x-show` writes inline styles.

**3. JSON-LD output changes shape (2.2).**

*What to do:* if you override `head/schema.html`, delete the override and move
your additions into `head/schema-extra.html`, setting `params.schema.type` for
the site-wide entity — an override silently costs you `WebPage`,
`BlogPosting`, the site entity, and both `BreadcrumbList` blocks. If you do
not override it, revalidate at Google's Rich Results Test. Practical risk is
low, since per v0.2.4's item 1.2 the old output never parsed at all, but
verify rather than assume.

**4. The Tailwind config becomes a preset (3.1).** Any site whose
`tailwind.config.js` does `require('./themes/ryder/tailwind.config.js')` gets
that file's dev globs, which match nothing from your project root.

*What to do:* switch to the preset form. This one fails loudly and immediately
at build time, so it is the least dangerous of the four.

```js
module.exports = {
  presets: [require('./themes/ryder/tailwind.preset.js')],
  content: [
    './themes/ryder/layouts/**/*.html',
    './layouts/**/*.html',
    './content/**/*.md',
    './hugo_stats.json',
  ],
};
```

Sites also inherit **3.2**: `themes/ryder/assets/css/style.css` no longer
exists. It was a committed 125 KB build artifact that no template read. If
anything in your site resolves it by hand, remove that.

### Not a change, but worth knowing

`[outputs]` is **not** inherited from a theme (3.4). If you have been carrying
`home = ["HTML", "RSS", "LLMSTxt"]` in your own config and were told it was a
redundant duplicate of the theme's, keep it — it is what produces `llms.txt`.
The `LLMSTxt` *output format* definition does come from the theme, which is why
that one line is all you need.

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
