[![exampleSite build](https://github.com/arts-link/ryder/actions/workflows/hugo.yml/badge.svg)](https://arts-link.github.io/ryder/)

# Ryder — A Hugo Theme

A Hugo theme built with TailwindCSS, Alpine.js, and Font Awesome. Intentionally barebones with practical defaults — drop it in and start writing.

Named after a late Rhodesian Ridgeback/Mastiff companion.

**[Live Demo →](https://arts-link.github.io/ryder/)**

> An open source project by **[Arts-Link](https://www.arts-link.com)**, maintained by **[Ben Strawbridge](https://www.benstrawbridge.com)**.

> **Current release: [Ryder v0.3.1](https://github.com/arts-link/ryder/releases/tag/v0.3.1)** — released July 31, 2026. This patch updates development dependencies and GitHub Actions. Sites upgrading from v0.2.5 should still follow the [v0.3.0 migration guide](docs/migration/v0.3.0.md) and review the [changelog](CHANGELOG.md) before upgrading.

---

## What's New in v0.4.0

- **Semantic color tokens** — the palette resolves through `--ryder-*` custom properties, so `[params.colors]` can repoint brand, brand-alt, accent, and the header/footer chrome without overriding a single class string. See [Color Tokens](#color-tokens).
- **One accent instead of six** — the tag cloud's yellow border and the CTA button's fuchsia ring both move to the theme accent (rose). `params.colors.legacyAccents = true` restores them.
- **Three new components** — a themed [form field](#form-fields) partial for the existing `ryderForm` engine, a `table-wrapper` shortcode that keeps wide tables from pushing the page sideways, and an empty state on list pages that no longer renders a blank page with a dead pager.

Sites upgrading from v0.3.x should read the [v0.4.0 migration guide](docs/migration/v0.4.0.md) — the accent change is the only thing that alters an existing site, and it is one config flag to undo. The reasoning behind the system is recorded in [docs/design-decisions.md](docs/design-decisions.md).

---

## What's New in v0.3.0

- **Safe, extensible structured data** — JSON-LD is built from Hugo dictionaries and serialized with `jsonify`; use `params.schema.type` and `head/schema-extra.html` to extend it without replacing Ryder's built-in schema.
- **One CSS build workflow** — Ryder now ships a reusable `tailwind.preset.js`; `hugo server` and `hugo --minify` compile Tailwind through PostCSS, so the old `build-tw`, `watch-tw`, and `deploy-tw` scripts are gone.
- **Stricter Content Security Policy** — the PostHog bootstrap is a fingerprinted external asset, `script-src` no longer gains `'unsafe-inline'`, and sites can allow individual inline scripts with `params.csp.scriptSrcHashes`.
- **Consumer-owned build configuration** — sites must keep their own `[build]` settings for Hugo stats and cachebusters, and their own `[outputs]` entry to generate `/llms.txt`; neither section is inherited from the theme.

New installations can continue with [Quick Start](#quick-start). Sites upgrading from v0.2.5 should use the [migration guide](docs/migration/v0.3.0.md) for the four breaking changes.

---

## Quick Start

If you're in a hurry, here's the minimal setup:

```bash
hugo new site <your-site>
cd <your-site>
git init

# Install theme
git submodule add https://github.com/arts-link/ryder.git themes/ryder

# Copy config and npm setup from exampleSite
cp -r themes/ryder/exampleSite/config/ ./config
cp themes/ryder/exampleSite/package.json .
cp themes/ryder/exampleSite/package-lock.json .
cp themes/ryder/exampleSite/*.config.js .
npm ci

# You must delete the dev-only theme path override before building your site
sed -i.bak '/^themesDir *=/d' config/_default/hugo.toml

# Update baseURL in config/_default/hugo.toml to your own URL

# Create a home page and start the server
hugo new content _index.md
hugo server -D
```

The copied config is a starter configuration from the theme demo. Before building your site, update site-facing values in `config/_default/hugo.toml` such as `baseURL`, `title`, `homePageFeedHeader`, `homePageFeatureHeader`, and the logo text settings so they match your site.

---

## Requirements

- Hugo 0.146+ (**extended** recommended; **required** if any Open Graph / processed image — including `og_image_default` — is a WebP)
- Node.js / npm

Theme development and tests require Node.js `^22.22.2`, `^24.15.0`, or 26+.

---

## Features

- **Dark mode** — toggle built in, or follow system preference
- **Two-level mobile nav** — Alpine-powered hamburger menu with configurable submenu trigger behavior
- **Card layouts** — multiple variants, configurable per section or globally
- **Featured grid** — promote any page to the homepage featured grid via front matter
- **Shortcodes** — alerts, maps, recipe schema, media embeds, CTAs, photo gallery, and more
- **Image galleries** — page-bundle gallery layout or shortcode-driven gallery with lightbox
- **Structured data** — WebPage, configurable site entity, BlogPosting, breadcrumbs, Recipe JSON-LD, and a `head/schema-extra.html` extension hook
- **Privacy-friendly analytics** — pluggable Plausible or PostHog integration
- **CSP-safe Alpine** — runs without `'unsafe-eval'`, with `ryderTrack`/`ryderForm` components, a custom-JS hook, and a dev-only linter (see [CSP-Safe Alpine](#csp-safe-alpine))
- **SEO & GEO built-in** — full JSON-LD structured data, Open Graph, Twitter Cards, and dynamic OG image generation on every page (see [SEO & GEO](#seo--geo))
- **Custom RSS feed** — styled XSLT browser-readable feed
- **Social links** — footer social icons via `data/social.json`
- **i18n** — partial translations for English, German, French
- **Template overrides** — header, footer, menu, and card partials can be swapped with your own suffix-based variants
- **Hidden home layout** — full-bleed cover image with minimal content for landing pages

---

## Installation

### As a Git Submodule

```bash
git submodule add https://github.com/arts-link/ryder.git themes/ryder
```

### Copy Config Files

```bash
cp -r themes/ryder/exampleSite/config/ ./config
cp themes/ryder/exampleSite/package.json .
cp themes/ryder/exampleSite/package-lock.json .
cp themes/ryder/exampleSite/*.config.js .
npm ci
```

**Required:** Delete the line `themesDir = "../.."` or `themesDir = "../../"` from `config/_default/hugo.toml` before you build. It exists only for theme development inside this repository and will break a normal site installation.

The copied config is a starter configuration from the theme demo. Update site-facing values in `config/_default/hugo.toml` such as `baseURL`, `title`, `homePageFeedHeader`, `homePageFeatureHeader`, and the logo text settings so they match your site.

---

## Configuration

Full example in [`exampleSite/config/_default/hugo.toml`](https://github.com/arts-link/ryder/blob/main/exampleSite/config/_default/hugo.toml).

### Key Parameters

```toml
[params]
  darkMode = "system"             # "system" (default), "toggle", or "off" — see Dark Mode below
  showHomeFeed = true            # Paginated feed on home page (page-overridable via .Param, e.g. in the home page's own front matter)
  showDate = true
  showAuthor = true
  showBreadCrumbs = true
  showShareButtons = false       # Social share buttons on single pages
  showCardLinkOverlay = false    # Whole-card click target
  showSummaryMeta = true         # Show meta on card summaries
  showReadOn = false             # "Read on" link on cards
  loadLeaflet = false            # Load Leaflet.js for map shortcodes
  navbar_fixed = false           # Sticky header

  homePageFeatureHeader = "Features"    # Label for featured grid
  homePageFeedHeader = "Latest"         # Label for paginated feed

  logo_firstWord = "your"
  logo_lastWord = "site"
  logo_tagline = "FOR HUGO WEBSITES"

  og_image_default = "images/og-default.webp"
  repository = "https://github.com/you/your-site"  # Enables footer GitHub links

  excludedSections = ["fineprint"]
  excludedCategories = ["catalog"]
  excludedtags = ["sample", "test"]

[params.twClasses]
  body = ""                      # <body> classes; default "bg-neutral-100 text-neutral-900 font-titillium"
  bodyDark = ""                  # <body> dark: classes; only emitted when darkMode != "off"
  headerBackgroundFrameOuter = "bg-gradient-to-r from-slate-900 to-slate-700 text-neutral-100"
  headerBackgroundFrameInner = "bg-cover h-[300px]"
  footerBackground = ""          # Falls back to headerBackgroundFrameOuter

[params.author]
  name = "Your Name"
  email = "you@example.com"
```

### Dark Mode

```toml
[params]
  darkMode = "system"   # "system" (default), "toggle", or "off"
```

- `"system"` (default) — the page follows the visitor's OS/browser preference. No toggle is shown.
- `"toggle"` — same as `"system"` on first load, plus a footer toggle that lets visitors switch and persists their choice to `localStorage`.
- `"off"` — dark mode is disabled entirely: the theme-boot script that applies the `dark` class is not loaded, no toggle is shown, and the `<body>` element is rendered without any `dark:` Tailwind classes at all (not just an unused `dark` class — the classes themselves are omitted).

`showDarkToggle = true` is a **legacy alias** for `darkMode = "toggle"`, kept for existing sites. If `darkMode` is not set explicitly:

| Site config | Resolved `darkMode` |
|---|---|
| nothing set | `"system"` |
| `showDarkToggle = true` | `"toggle"` |

Prefer `darkMode` in new configuration; `showDarkToggle` is only read as a fallback when `darkMode` is absent.

### Template Overrides

Ryder keeps the page frame stable and lets you swap selected partials by suffix instead of editing the theme's base layout.

For example, if you set:

```toml
[params]
  headerType = "-custom"
  footerType = "-custom"
```

then Hugo will look for:

- `layouts/partials/header-custom.html`
- `layouts/partials/footer-custom.html`

in your site first, before falling back to the theme.

The same pattern applies to other overridable partials:

```toml
[params]
  menuType = "-custom"
  listCardType = "-custom"
  homeListCardType = "-custom"
  homeFeatureListCardType = "-custom"
```

That resolves to partials such as:

- `layouts/partials/menu-custom.html`
- `layouts/partials/card-custom.html`

Use this when you want to replace a whole component cleanly without editing `baseof.html` or forking the theme's default partial names.

#### One variant plus `.Param` for the skin

Reach for a `-suffix` variant (above) only when you need a genuinely different
*structure*. For a cosmetic change — different background, different nav
treatment — prefer a `.Param` the base partial already reads, so you get the
one bug fix or feature added to `header.html` in the future for free instead
of carrying it into a forked copy forever.

`header.html` already reads page-overridable `twClasses.headerBackgroundFrameOuter`,
`twClasses.headerBackgroundFrameInner`, and `twClasses.headerBackgroundImage`
for exactly this. It also resolves a nav skin — `navClass` (or the
`twClasses.nav` convention) — and passes it into the menu partial, so a single
page or section can restyle just the `<nav>` without forking `header.html`
into a new `headerType` variant just to change classes:

```toml
+++
title = "A page with a different nav treatment"
navClass = "main-menu-nav bg-fuchsia-900/40 rounded-full px-2"
+++
```

or site-wide:

```toml
[params.twClasses]
  nav = "main-menu-nav bg-fuchsia-900/40 rounded-full px-2"
```

(Keep the base `main-menu-nav` class if you only mean to add to it, not
replace it — `main.css`'s nav styling lives on that class.) This is the pattern to
reach for before writing a new `header-*.html` variant whose only difference
from `header.html` is a handful of classes.

### List Layouts

`_default/list.html` always paginates `.Pages` into a card grid. For a section
that's really a single data-driven page with no children (an "about" or
"contact" page sourced from `data/*.json`, say), that pagination shell is dead
weight and used to force a full fork of `list.html`. Set `layout` in the
section's `_index.md` front matter instead:

```toml
+++
title = "About"
layout = "list-plain"
+++
```

`_default/list-plain.html` renders title + `.Content` only — no pagination, no
card grid. This uses Hugo's own `layout` front-matter field (not a theme
param) because, unlike `headerType`/`menuType` above, Hugo has no other
mechanism for choosing between two *top-level* list templates.

Pair it with `partials/utils/data-items.html`, a returning partial for the
"does this data file have anything in it" check that's easy to end up
hand-rolling at every call site:

```go-html-template
{{ $items := partial "utils/data-items.html" "press" }}
{{ if gt (len $items) 0 }}
  ...
{{ end }}
```

It resolves `.Site.Data.<name>.items`, defaulting to an empty slice when the
data file or its `items` key is missing, so callers only need to check
`len()`. See [`exampleSite/content/press/_index.md`](https://github.com/arts-link/ryder/blob/main/exampleSite/content/press/_index.md)
for both in use together, and the [conditional menu entries](#menus) below,
which reuse the same partial.

### Global Banners

```toml
[[params.alphaAlert]]
  alertType = "info"             # info | success | warning | danger
  alertTitle = "Heads up"
  alertMessage = "Something worth knowing."
  alertIconClass = "fa-solid fa-circle-info"
  dismissable = true
  weight = 1
```

### Footer Taxonomy Lists

```toml
[params.footer]
  tagCloud = true

[[params.footer.taxonomies]]
  name = "tags"
  title = "Top Tags"
  minCount = 2

[[params.footer.taxonomies]]
  name = "categories"
  title = "Categories"
  minCount = 1
```

### Social Links

Configured via `data/social.json` (not params), in either of two shapes.

**Structured** — an `icon` is a Font Awesome class string:

```json
{
  "main": [
    { "title": "GitHub", "name": "github", "icon": "fab fa-github", "link": "https://github.com/you", "weight": 10 }
  ]
}
```

**Flat name → URL map** — what Decap CMS emits, and what used to render
nothing at all:

```json
{
  "instagram": "https://instagram.com/you",
  "tiktok": "https://tiktok.com/@you"
}
```

Entries in the flat shape have no `icon` field, so one is resolved by
platform name instead. Ryder ships inline SVGs for Instagram, TikTok, Apple
Music, Tidal, and Spotify — matched case-insensitively, ignoring spaces,
dashes, and underscores (`"Apple Music"`, `"apple-music"`, and
`"apple_music"` all resolve the same icon) — rather than widening the
tree-shaken Font Awesome brand set that `tests/unit/faIcons.test.js` enforces
against unused imports. Anything else falls back to a generic external-link
icon. The same fallback also applies to structured entries that omit `icon`,
so you can mix both within `main` (see
[`exampleSite/data/social.json`](https://github.com/arts-link/ryder/blob/main/exampleSite/data/social.json)).

### Analytics

Select a provider explicitly in your site params:

```toml
[params]
  analytics_provider = "plausible" # or "posthog"
```

#### Plausible

```toml
[params]
  plausible_domain = "yourdomain.com"
  plausible_advanced = true
```

#### PostHog

**Preferred: set it directly in params.** No Hugo security configuration required — this is the simplest path and the one to reach for first:

```toml
[params]
  analytics_provider = "posthog"
  posthog_key = "phc_yourprojectkey"
  posthog_host = "https://t.example.com"
  posthog_ui_host = "https://us.posthog.com"
  posthog_person_profiles = "identified_only"
```

**Alternative: environment variables.** Useful for keeping the key out of version control (e.g. injecting it at CI/deploy time). Params always take precedence when both are set.

- `PUBLIC_POSTHOG_KEY`
- `PUBLIC_POSTHOG_HOST`
- `PUBLIC_POSTHOG_UI_HOST`

This path requires one extra step the params path doesn't: Hugo's `getenv` only reads environment variables matching `^HUGO_` or `^CI$` by default. Any `PUBLIC_POSTHOG_*` variable is silently read as empty — no error, no warning — unless you explicitly widen the allowlist:

```toml
[security]
  [security.funcs]
    getenv = ['^HUGO_', '^CI$', '^PUBLIC_']
```

Without this block, PostHog renders nothing at all, with no signal as to why — the same silent-empty result as simply never setting the variables. If `analytics_provider = "posthog"` is set and no key can be found from either source, the build now emits a warning naming both possible causes.

### Content Security Policy

Ryder emits a `Content-Security-Policy` via `<meta http-equiv>` with secure defaults, extendable per-directive under `[params.csp]`:

```toml
[params.csp]
  # disabled = true                             # opt out entirely (e.g. your host sets the header instead)
  # imgSrc    = "https://cdn.example.com"
  # scriptSrc = "https://cdn.example.com"
  # styleSrc  = "https://cdn.example.com"
  # connectSrc = "https://api.example.com"
  # fontSrc   = "https://cdn.example.com"
  frameSrc  = "https://your-embed-host.example.com"   # any additional iframe hosts, verbatim
  embeds    = ["youtube", "vimeo", "soundcloud", "spotify", "umap"]
  # scriptSrcHashes = ["sha256-…"]                    # SHA-256 of each of your inline <script>s
  # extraDirectives = "worker-src 'none';"
```

#### `script-src` does not allow inline scripts

Every script Ryder emits — `main.js`, `themeBoot.js`, the dev linter, and the
PostHog bootstrap — is a real asset served from `'self'` with a Subresource
Integrity hash, so `script-src 'self'` covers all of them. **`'unsafe-inline'`
is never added to `script-src` in production**, and turning on analytics no
longer adds it for you.

> **Changed in v0.3.0 — this can break an existing site silently.** Before
> v0.3.0, enabling PostHog appended `'unsafe-inline'` to `script-src` for the
> whole site, because `posthog.html` inlined its bootstrap snippet. Any inline
> `<script>` of your own was being permitted by that side effect. It no longer
> is. CSP violations do not fail the build — they fail in the visitor's
> browser — so grep your templates for `<script>` without a `src` before
> upgrading, and verify with a production build and a browser console showing
> zero violations rather than by reading the config.

If your site has an inline script of its own, you have two options.

**Preferred — list its hash.** The policy ships as a `<meta http-equiv>` tag,
and a meta-delivered CSP cannot carry a nonce (nonces must be generated per
response, which a static site never gets to do). Hashes are the alternative:

```toml
[params.csp]
  scriptSrcHashes = ["sha256-Ki9lqrTGVaMOtvJBiJhb3D2Cu5g0S4XLNJfDmxvGvBM="]
```

Load the page and read the hash out of the CSP violation message in the
browser console — it names the exact value the blocked script needs. Quotes
are added for you if you leave them off. This is the same mechanism Ryder
already used for Plausible's advanced-mode inline scripts.

**Escape hatch — turn script CSP off.** Still supported, but now something
you say deliberately rather than something analytics does to you:

```toml
[params.csp]
  scriptSrc = "'unsafe-inline'"
```

A third option is usually better than both: move the code into
[`assets/js/extended.js`](#assetsjsextendedjs--the-custom-js-hook), where it
is bundled into `main.js` and needs no CSP allowance at all.

Note that **`style-src` does keep `'unsafe-inline'`**, and that is deliberate:
Alpine's `x-show` sets `display:none` as an inline style, so removing it would
break every collapsible element in the theme. `head/csp.html` documents both
decisions inline.

By default `default-src 'self'` blocks every iframe, including the theme's own `soundcloud` and `openstreetmap` shortcodes. `frame-src` is assembled from three sources and folded together (deduped), and omitted entirely when none apply:

1. **Auto-detected hosts.** The `soundcloud` and `openstreetmap` shortcodes register their own iframe host automatically whenever they're used on a page — no config needed.
2. **`embeds` preset.** A list of known embed names — `youtube`, `vimeo`, `soundcloud`, `spotify`, `umap` — mapped to their hosts. Use this for embeds the theme can't auto-detect, such as Hugo's built-in `youtube` and `vimeo` shortcodes.
3. **`frameSrc`.** Any additional hosts, added verbatim.

### Logo

By default the logo renders as a two-word text mark built from `logo_firstWord` and `logo_lastWord`. If neither is set the first two words of `title` in your config are used.

**Text logo**

```toml
[params]
  logo_firstWord = "my"          # First word (sky-blue)
  logo_lastWord  = "site"        # Second word (lime-green)
  logo_tagline   = "FOR HUGO WEBSITES"   # Small tagline below the words
  logo_fontClass = "font-titillium"      # Optional custom Tailwind font class
  logo_collapse  = true          # Collapse to initials on small screens
```

**Image logo**

Place your logo file anywhere under `static/` or `assets/` and point `logo_png` at it. The image is scaled to a maximum height of 4 rem; width is automatic.

```toml
[params]
  logo_png = "/images/logo.png"  # Path relative to your site root
```

When `logo_png` is set the text words are hidden. `logo_tagline` is still shown below the image if it is also set.

Steps:
1. Copy your file (`.png`, `.svg`, `.webp`, etc.) into `static/images/` in your site.
2. Set `logo_png = "/images/logo.png"` in `[params]` inside `config/_default/hugo.toml`.

`logo_png` is read via `.Param`, so it is page-overridable (front matter wins
over site config) — this is the authoritative contract; a `.Site.Params.logo_png`-only
reading is not supported.

**Wrapper chrome.** The grey rounded box (background, hover state, padding)
around the logo makes sense as a frame for the generated text mark, but is
usually unwanted around a real logo image. It is dropped automatically once
`logo_png` is set:

```toml
[params]
  logo_png = "/images/logo.png"   # wrapper chrome is dropped automatically
```

To keep some wrapper styling (with either logo type), set `logo_wrapperClass`
explicitly — it always wins over the default:

```toml
[params]
  logo_wrapperClass = "bg-white/80 rounded-lg p-2"
```

### Favicon

`head/favicon.html` used to pin a single hardcoded `/favicon.ico?v=4` with no
way to change the path, cache-busting version, or add an apple-touch-icon /
web manifest link short of overriding the whole partial. Configure it under
`[params.favicon]`:

```toml
[params.favicon]
  ico            = "/favicon.ico"                 # default; the theme ships this file
  version        = "4"                            # cache-busting ?v= suffix; set "" to omit
  svg            = "/images/favicon.svg"          # default; the theme ships this file
  appleTouchIcon = "/images/apple-touch-icon.png"  # default; the theme ships this file
  webmanifest    = ""                              # no default; the theme ships no manifest file
```

Every key defaults to the file the theme already ships (except
`webmanifest`, which has none) — set a key to `""` explicitly to omit that
tag entirely, or to a different path to replace it.

**Site-level only, not page-overridable.** `head.html` loads this partial via
`partialCached` with no explicit cache key, so it renders once and that
single render is reused for every page — a per-page override would silently
leak onto every other page too. Read `site.Params` directly, in
`config/_default/hugo.toml` (or equivalent), not front matter.

### Fonts

Titillium Web is hardcoded in four places in the theme (tracked as
[issue #3](https://github.com/arts-link/ryder/issues/3)): `head/fonts.html`'s
Google Fonts URL, `baseof.html`'s `font-titillium` body class,
`tailwind.config.js`'s `fontFamily.titillium` key, and a raw `font-family` in
`assets/css/main.css`. Two of those four are covered by `params.fonts`:

```toml
[params.fonts]
  family             = "Titillium Web"                   # default; sets --ryder-font-family and the display name below
  googleFontsFamily  = "Titillium+Web:wght@400;600;700"  # default; the family= query value Google Fonts expects
  disableGoogleFonts = false                             # true if you self-host fonts, or don't want this stylesheet at all
```

`family` sets a `--ryder-font-family` CSS custom property that
`assets/css/main.css`'s `.resp-sharing-button` rule now reads (falling back
to Titillium Web if unset), rather than hardcoding the font name directly.
Set only `family` (without `googleFontsFamily`) to point at a font you load
some other way — self-hosted, a different provider — while skipping this
partial's Google Fonts request via `disableGoogleFonts`.

Site-level only, same `partialCached` constraint as [Favicon](#favicon)
above.

**The other two hardcoded sites are covered elsewhere, not here**: the body
class is already overridable via `[params.twClasses] body` (added
alongside the `.site-shell` wrapper), and `tailwind.config.js`'s
`fontFamily.titillium` key will move into the Tailwind preset. This does not
close issue #3 by itself, since three of the four sites are theme files a
consumer must not edit directly — see the issue for the full picture.

### Menus

Ryder supports two-level menus on desktop and mobile. Parent items with children can use one of two submenu trigger modes:

- `caret` (default): the parent label remains a link, and only the caret toggles the submenu
- `button`: the whole parent row toggles the submenu, and the parent landing page is not linked

Example:

```toml
[[menus.main]]
  name = "Docs"
  pageRef = "/docs"
  weight = 20
  [menus.main.params]
    submenuTrigger = "button"
```

See the example docs page for a complete menu setup:
[`exampleSite/content/docs/menus.md`](https://github.com/arts-link/ryder/blob/main/exampleSite/content/docs/menus.md)

#### Conditional menu entries

Hide a menu entry unless a `data/*.json` file (shaped `{"items": [...]}`) has
content, via `hideIfEmptyData` under the entry's own `[menus.main.params]`:

```toml
[[menus.main]]
  name = "Press"
  pageRef = "/press"
  weight = 40
  [menus.main.params]
    hideIfEmptyData = "press"   # renders only if data/press.json's items is non-empty
```

This replaces forking the entire nav to append a hand-rolled
`{{ if gt (len (.Site.Data.press.items | default slice)) 0 }}` check — see
`exampleSite/config/_default/hugo.toml`, where "Press" (backed by
`data/press.json`) renders and "Merch" (backed by a `data/merch.json` that
doesn't exist) does not.

### GitInfo (optional)

Enables GitHub commit/history/blame links in the footer. Has a 40–50% build time cost on large sites — disabled by default.

```toml
# config/production/hugo.toml
enableGitInfo = true
```

---

## Shortcodes

| Shortcode | Description |
|---|---|
| `alert-wrapper` | Alert boxes (info/success/warning/danger), usable as shortcode or partial |
| `cta-button` | Call-to-action button |
| `leaflet` | Interactive map from coordinates (self-hosted Leaflet) |
| `openstreetmap` | Embed a pre-built uMap |
| `lat-long-box` | Display coordinates in a formatted box |
| `recipe-ingredients-list` | Render recipe ingredients from front matter |
| `recipe-howto-steps-list` | Render recipe steps from front matter |
| `picture` | Responsive image with lazy loading |
| `soundcloud` | SoundCloud embed |
| `youtube-embed` | YouTube embed that auto-registers its CSP host (named distinctly from Hugo's built-in `youtube`) |
| `spotify-embed` | Spotify track/album/playlist/artist/episode/show embed, auto-registers its CSP host |
| `video-lightbox` | Clickable thumbnail that opens a modal with a YouTube or Vimeo embed (beside `imageGallery`'s image-only lightbox) |
| `amazon-associate-link` | Affiliate link with disclosure |
| `font-awesome` | Inline Font Awesome icon |
| `highlight-github` | GitHub-styled syntax highlight block |
| `table-wrapper` | Wraps a Markdown table in a themed shell that scrolls horizontally instead of widening the page |

### Recipe Schema

Set `recipe = true` in front matter to enable Schema.org/Recipe JSON-LD structured data. Ingredients and steps live entirely in front matter:

```toml
recipe = true
recipeCuisine = "Breakfast"
prepTime = "PT10M"
cookTime = "PT30M"
totalTime = "PT40M"
recipeYield = "4 servings"
calories = 350

recipeIngredients = [
  "2 cups flour",
  "1 cup sugar",
  "**Wet ingredients",   # prefix ** for a subheading
  "2 eggs",
]

[[recipeInstructions]]
  name = "mix"
  text = "Combine dry ingredients."
[[recipeInstructions]]
  name = "bake"
  text = "Bake at 350°F for 30 minutes."
  image = "step-bake.webp"  # optional
```

Then in content:

```
{{</* recipe-ingredients-list */>}}
{{</* recipe-howto-steps-list */>}}
```

### Maps

Requires `loadLeaflet = true` in params.

```
{{</* leaflet id="map1" lat="40.71" lon="-74.00" zoom="13" markerPopup="New York" */>}}
{{</* lat-long-box latitude="40.71" longitude="-74.00" */>}}
{{</* openstreetmap mapName="your-map-name-123456" */>}}
```

---

## SEO & GEO

Ryder ships with a complete search and AI optimisation stack — no plugins, no extra configuration required. Every page gets the right metadata automatically.

### What Ryder Outputs on Every Page

| Output | What It Does |
|---|---|
| `<meta name="description">` | Page snippet for search results — from `description` front matter, then summary, then site description |
| Open Graph tags | Social link previews (Facebook, LinkedIn, Slack, Discord) |
| Twitter / X Cards | `summary_large_image` when a featured image is present, `summary` otherwise |
| JSON-LD `BlogPosting` | Article authorship, dates, and keywords for Google rich results and AI crawlers |
| JSON-LD `WebPage` + site entity | Homepage entity signals — entity type set by `params.schema.type` |
| JSON-LD `BreadcrumbList` | Section and category navigation trails for rich-result breadcrumbs |
| JSON-LD `Recipe` | Full recipe structured data (ingredients, steps, nutrition) when `recipe = true` |
| Dynamic OG image | Auto-generated Open Graph image with title text when no page image exists |

### `llms.txt` — you must declare `[outputs]` yourself

Ryder defines an `LLMSTxt` output format and ships the
`_default/home.llmstxt.txt` template that renders it: a plain-text index of
your site for AI crawlers, served at `/llms.txt`.

**The format definition is inherited from the theme. The `[outputs]` block is
not.** Add this to your own site config, or no `llms.txt` is ever written:

```toml
[outputs]
  home = ["HTML", "RSS", "LLMSTxt"]
```

You do **not** need to redeclare `[outputFormats.LLMSTxt]` — Hugo does merge a
theme's `outputFormats` into the site's, so naming `"LLMSTxt"` above is enough.
It is specifically `outputs` that does not propagate, the same way `build`
does not (see [Build configuration](#build-configuration)).

Verified against a scratch consumer site whose entire config was `baseURL`,
`title`, and `theme = "ryder"`:

| Consumer config | `hugo config` reports | `/llms.txt` |
|---|---|---|
| no `[outputs]` | `home = ['html', 'rss']` — Hugo's stock default | not written |
| `home = ["HTML", "RSS", "LLMSTxt"]` | as written | written |

In both runs `[outputformats.llmstxt]` was present in the merged config, which
is what makes the one-line block above sufficient.

> If you are reading older guidance that calls this block redundant because
> "theme config merges into the site's" — it isn't, and it doesn't. Hugo merges
> only a subset of root config sections from a theme.

### What Is GEO?

**Generative Engine Optimization (GEO)** is the practice of structuring content so AI-powered search tools (ChatGPT, Perplexity, Google AI Overviews, Gemini) can understand, cite, and accurately attribute it. Ryder's JSON-LD blocks give every post clear authorship, semantic type information, and machine-readable facts — exactly what these systems need to surface your content confidently.

### Configuration

Most SEO metadata is automatic. A few optional settings unlock additional features:

```toml
[params]
  og_image_default = "images/og-default.webp"   # Base image for generated OG cards; assets/-relative ONLY (see note below)

[params.author]
  name  = "Your Name"
  email = "you@example.com"                      # Flows into author/publisher schema

[params.social]
  twitter = "yourtwitterhandle"                  # Adds twitter:site to every page

[params.ogImageText]
  fontColor = "#085624"                          # Title text colour on generated OG images
  x = 50                                         # Text x position (px from left)
  y = 430                                        # Text y position (px from top)

[params.schema]
  type = "Organization"                          # Site-wide JSON-LD entity on the home page
```

### Structured Data (JSON-LD)

Every JSON-LD block Ryder emits is built as a Hugo `dict` and serialised with
`jsonify`. That is a deliberate constraint, not a style preference: JSON
hand-written as template text fails **silently**. A stray comment, an unset
optional value leaving a dangling `"key": ,`, or a trailing comma produces a
block no consumer can parse, and nothing in the Hugo build reports it. If you
extend Ryder's structured data, build a dict — never write JSON punctuation
that reaches the output.

#### `params.schema.type` — change the site-wide entity

The home page carries one site-wide entity alongside its `WebPage` block.
It defaults to `Organization`. Set any schema.org type instead:

```toml
[params.schema]
  type = "MusicGroup"     # or Person, LocalBusiness, NGO, …
```

`Person` receives an `image` rather than a `logo`, since schema.org gives
`logo` to `Organization` and its subtypes only. Otherwise the entity is built
from `title`, `params.author.email`, and `params.logo_png`.

#### `head/schema-extra.html` — add types without losing the built-in ones

To emit **additional** types — `MusicEvent`, `Product`, `FAQPage` — do **not**
override `layouts/partials/head/schema.html`. Overriding it silently drops
`WebPage`, `BlogPosting`, the site entity, and both `BreadcrumbList` blocks,
with no build error and correct-looking HTML. That trap is the reason this hook
exists.

Instead, create:

```
layouts/partials/head/schema-extra.html
```

It is an empty no-op in the theme, called from `head-seo.html` immediately
after `head/schema.html`, and it shadows cleanly through Hugo's union
filesystem — the same pattern as `extend_head.html`. It receives the page as
its context.

```go-html-template
{{ if .IsHome }}
  {{ $band := dict
       "@context" "https://schema.org"
       "@type" "MusicGroup"
       "name" site.Title
       "url" site.BaseURL
       "genre" (slice "indie" "shoegaze")
  }}
  <script type="application/ld+json">{{ $band | jsonify | safeJS }}</script>
{{ end }}
```

#### `extend_head.html` — inject anything else into `<head>`

`layouts/partials/extend_head.html` is an empty partial called as the last line
of `head.html`. Shadow it to add verification meta tags, a third-party
`<script src>`, preload hints, or any other head content, without touching
`head.html`:

```go-html-template
<meta name="google-site-verification" content="…">
<link rel="preconnect" href="https://cdn.example.com">
```

It runs after the CSP meta tag is emitted, so anything you add here still has
to satisfy the policy — see [Content Security Policy](#content-security-policy).
Prefer `head/schema-extra.html` for structured data specifically, so the two
concerns stay separable.

### Front Matter That Feeds Schema

| Front matter | Where It Appears |
|---|---|
| `description` | `<meta name="description">`, `og:description`, `BlogPosting.description` |
| `tags` | `article:tag` OG properties, `BlogPosting.keywords` |
| `date` | `article:published_time`, `BlogPosting.datePublished` |
| `lastmod` | `article:modified_time`, `BlogPosting.dateModified` |
| `categories` | Second `BreadcrumbList` from taxonomy path |
| `recipe = true` | Enables full `Recipe` JSON-LD block |

### Dynamic OG Image

The OG image resolver checks, in order:

1. **`og_image` front matter** — a per-page escape hatch. Point it at a
   resource (a page-bundle image, or a path under `assets/`; a leading slash
   is tolerated and stripped) and it's used as-is for that page, no
   generation.
2. **Page-bundle resources** — a `feature*`, `cover*`, or `thumbnail*` image
   already in the page's bundle.
3. **Generated card** — if neither of the above applies, Ryder generates an
   Open Graph image at build time by overlaying the page title and site name
   onto your `og_image_default` base image. The result is a static `.webp`
   baked into your build — no server-side rendering.

```toml
+++
title = "A specific page"
og_image = "my-hand-designed-card.png"   # page-bundle resource, or assets/-relative
+++
```

If you already have front matter named `og_image` for something else, note
that it is now consumed by this resolver as of this widening.

**`og_image_default` must live under `assets/`, not `static/`.** It is resolved with `resources.Get`, which only sees files under `assets/` — unlike `logo_png` (see [Logo](#logo)), which works from either `static/` or `assets/`. A leading slash is tolerated and stripped, but the file itself must be under `assets/`; a missing or `static/`-only file now fails the build with a named error instead of a nil-pointer panic.

See the full feature breakdown and tips in the [SEO & GEO docs post](https://arts-link.github.io/ryder/docs/seo-and-geo/).

---

## Featured Grid (Homepage)

Add `homeFeature = true` to any page's front matter to include it in the homepage featured grid. Use `homeFeatureWide = true` for a full-width card. Optionally set `homeFeatureIcon` (Font Awesome class) and `homeFeatureTitle`.

```toml
homeFeature = true
homeFeatureIcon = "fa-solid fa-star"
homeFeatureTitle = "Custom card title"
```

---

## Template Variants

Header, footer, menu, and card partials support variant suffixes. Set in `hugo.toml` or per-page front matter:

```toml
headerType = "-custom"   # loads header-custom.html
footerType = "-custom"   # loads footer-custom.html
menuType = "-custom"     # loads menu-custom.html
listCardType = "-super-simple"
```

---

## CSS Development

### There is no separate CSS build step

**`hugo server` and `hugo --minify` are the whole workflow.** Tailwind compiles
*inside* the Hugo build: `head/css.html` pipes `assets/css/main.css` through
`css.PostCSS`, which runs your `postcss.config.js`, which runs Tailwind. There
is no watcher to start in a second terminal and no artifact to commit.

What that requires at your **project root** (not in `themes/ryder/` — Hugo
invokes PostCSS from your project root, so that is the only `node_modules` it
consults):

```bash
npm i -D "tailwindcss@^3.4.0" postcss postcss-cli autoprefixer @tailwindcss/typography
```

**Pin Tailwind to v3.** Ryder is a Tailwind v3 theme: `tailwind.preset.js` uses
v3 config syntax, and v4 cannot be used as a PostCSS plugin directly. A bare
`npm i -D tailwindcss` installs v4 today and the build fails with *"It looks
like you're trying to use `tailwindcss` directly as a PostCSS plugin"*.

plus a `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

and a `tailwind.config.js` requiring the theme's preset (see below). With those
in place:

```bash
hugo server        # dev, with live CSS rebuilds
hugo --minify      # production
```

> **Removed in v0.3.0: `npm run build-tw`, `watch-tw`, and `deploy-tw`.** They
> ran the Tailwind CLI to write `themes/ryder/assets/css/style.css`, a file no
> template ever read, and earlier versions of this README presented them as
> *the* build workflow — which pushed consuming sites into a two-terminal dev
> loop that was never required. If any CI, Vercel, or Netlify build command
> runs `npm run build-tw && hugo --minify`, drop the first half; it will now
> fail on a missing script. Confirm `hugo --minify` alone works before you
> upgrade.

### The Tailwind preset

Ryder ships its design tokens as a **preset**, `tailwind.preset.js`. Your site's
`tailwind.config.js` requires it and supplies its own `content` globs:

```js
// tailwind.config.js — at your project root
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

The preset carries `theme`, `darkMode`, and `plugins` — the theme's colours,
`fontFamily`, custom `screens` (`xs`, `3xl`), background images, `darkMode:
'class'`, and the typography plugin. Add your own tokens under `theme.extend`
and they merge on top; set a key under `theme` directly and it replaces the
preset's.

**The preset deliberately carries no `content`.** Content globs resolve
relative to wherever Tailwind is invoked, which for your site is your project
root — a path the theme cannot know. This is also why you must not
`require('./themes/ryder/tailwind.config.js')`: that file's globs are written
for *this repository's* directory layout, so from your project root
`./exampleSite/...` does not exist and `./themes/ryder/layouts/...` resolves to
`themes/ryder/themes/ryder/layouts/...`. Tailwind finds no classes and emits an
almost-empty stylesheet, with no error.

> **Upgrading from v0.2.x?** If your `tailwind.config.js` requires the theme's
> `tailwind.config.js`, switch to the `presets: [...]` form above. This one
> fails loudly at build time, so you will not miss it.

Note the `fontFamily.titillium` entry resolves through
`var(--ryder-font-family, "Titillium Web")`, so the `font-titillium` class that
`baseof.html` puts on `<body>` follows [`[params.fonts]`](#fonts) rather than
contradicting it. If you replace `fontFamily` wholesale in your own config,
keep that indirection or set `twClasses.body` to a class of your own.

### Color Tokens

*New in v0.4.0.* Ryder's colors resolve through CSS custom properties, so you
can repoint the palette from config instead of overriding class strings one
element at a time:

```toml
[params.colors]
  brand     = "12 74 110"   # logo word 1, nav links, article meta icons, blockquote
  brand-alt = "54 83 20"    # logo word 2, active nav entry
  accent    = "217 70 239"  # aside icons, tag chips, tag cloud
```

`chrome-from` and `chrome-to` are also declared, but **nothing in the theme
reads them** — the header and footer gradients come through
`twClasses.headerBackgroundFrameOuter`, which deliberately stays a literal
Tailwind string. They exist so you can use `from-ryder-chrome-from` /
`to-ryder-chrome-to` in class strings of your own; setting them will not retint
your header.

**Values are RGB channel triplets, not hex** — `"244 63 94"`, not `"#f43f5e"`.
This is load-bearing, not stylistic: a hex value inside `var()` works for
`text-`, `bg-`, and `border-`, then silently produces *nothing* for every
opacity modifier, and Ryder uses those throughout (`border-ryder-accent-300/80`,
`dark:bg-ryder-accent-950/40`, the share-button fills at `/88`). Channels
interpolate with Tailwind's `<alpha-value>` and keep them working. A value in
any other format is ignored, with a build warning naming the key.

Each of `brand`, `brand-alt`, and `accent` also carries a full `50`–`950` ramp,
because the theme uses more than one shade of each — the nav alone spans
`brand-100` through `brand-800`. Setting the bare token moves **only that
family's canonical step**, and which step that is differs per family: `brand`
aliases `brand-800`, `brand-alt` aliases `brand-alt-800`, `accent` aliases
`accent-500`.

This catches people out. The default CTA button uses `accent-600` / `accent-500`
/ `accent-300` for border, hover, and focus ring — so setting `accent` alone
moves the hover and leaves the border and ring rose. Set every step a component
uses; `rg 'ryder-accent-' layouts assets/css` lists them. Anything left unset
keeps the theme default, so a partial override is safe, just incomplete.

The preset exposes all of them as ordinary Tailwind colors, usable anywhere you
write a class — including in `twClasses`:

```
text-ryder-brand        bg-ryder-accent-50    border-ryder-brand-alt-800
from-ryder-chrome-from  to-ryder-chrome-to    ring-ryder-accent-300/80
```

Ryder's own shipped `twClasses` defaults deliberately stay on plain Tailwind
classes. They get copied into user configs, and a default that references the
token layer while the copy doesn't leaves you with half a palette. Surfaces
(`neutral-*`), structural greys, the alert color triples, and the
Amazon/Spotify button fills are not tokenized either — see
[docs/design-decisions.md](docs/design-decisions.md) for the reasoning.

Full reference, including which element each token drives:
`/docs/css-overrides/#color-tokens` on the demo site.

### Build configuration

**Add this `[build]` block to your own site config** — Hugo merges only a subset of root config sections from themes, and `build` is not one of them, so you do **not** inherit it from Ryder:

```toml
[build]
  writeStats = true
  [[build.cachebusters]]
    source = "(postcss|tailwind)\\.config\\.js"
    target = "css"
  [[build.cachebusters]]
    source = "assets/.*\\.(js|ts|jsx|tsx)"
    target = "js"
  [[build.cachebusters]]
    source = "assets/.*\\.(css|scss|sass)"
    target = "css"
```

`writeStats` produces `hugo_stats.json` at your project root, which `tailwind.config.js` globs for class discovery; the cachebusters make `hugo server` pick up CSS/JS rebuilds. Without the block, Tailwind silently falls back to the `layouts/**/*.html` globs — most classes are still found, so nothing appears broken, but any class assembled dynamically in a template is purged from the CSS. **Add `hugo_stats.json` to your `.gitignore`.** Hugo rewrites it on every build, so tracking it means every `hugo server` run dirties your working tree and blocks the next `git pull`. This theme tracked it until v0.3.0 and untracked it for exactly that reason.

The tradeoff is small and worth stating precisely: on a *cold* clone with no prior build, the first CSS compile is missing any class that exists only in the stats file — classes assembled dynamically in a template rather than written literally, such as `resp-sharing-button--small` built from `[params.shareButtons] size`. In this theme's own exampleSite that is 3 classes out of 726. Every later build has them. **If you build release artifacts from a fresh clone in CI, build twice**, or commit the file deliberately and accept the pull friction.

> **v0.2.4 note.** That release moved this block into the theme's own config on the assumption that consumers would inherit it. They don't. If you upgraded to v0.2.4 and deleted your `[build]` block, put it back.

---

## CSP-Safe Alpine

**Read this before writing any `x-` or `@` attribute.** Ryder bundles
[`@alpinejs/csp`](https://alpinejs.dev/advanced/csp), not standard Alpine, so the
theme works under a Content Security Policy without `'unsafe-eval'`. The tradeoff
is that inline Alpine expressions are **not** JavaScript. They are parsed by a
small evaluator that resolves every identifier against the component's own
Alpine scope.

Two consequences, and they have caused real outages in production sites built on
this theme — silently, because a broken directive renders normally and the
handler simply never fires:

**1. Inline expressions cannot reach globals.** `posthog`, `window`, `document`,
`fetch`, `gtag` — none of them are in Alpine's scope, so none of them resolve.

```html
<!-- BROKEN: `posthog` is a global, not component state -->
<a @click="posthog.capture('signup_click')">Sign up</a>

<!-- BROKEN: `window` is no more reachable than `posthog` -->
<button @click="window.myHelper()">Go</button>
```

**2. Arrow functions are a parse error.** `@click="$nextTick(() => x)"` never
runs.

What *does* work is referencing properties and methods that live on the
component, including calling them with arguments — `@click="dismiss()"`,
`x-show="!isValidAsin(asin)"`. So the fix is always the same: **put the logic in
an `Alpine.data()` component and pass what it needs through `data-*`
attributes.**

The theme ships the two components sites reach for most.

### `ryderTrack` — analytics click tracking

```html
<a href="/tickets/" x-data="ryderTrack" @click="track"
   data-track-event="ticket_link_click"
   data-track-props='{"venue":"The Roxy"}'>Tickets</a>
```

The event name and props are read off the clicked element and forwarded to
whichever provider [`analytics_provider`](#analytics) selects (PostHog and
Plausible are both handled). It is deliberately forgiving: if no provider is
present — unset, or the script was blocked by an ad blocker — the click is a
silent no-op rather than an error, and malformed `data-track-props` JSON warns in
the console and degrades to `{}` instead of breaking the handler, which is often
also responsible for a navigation.

`data-track-props` is optional and must be a JSON **object**. Mind the quoting:
single quotes outside, double quotes inside.

### `ryderForm` — declarative JSON form POST

```html
<form x-data="ryderForm" @submit.prevent="submit"
      data-form-action="https://api.example.com/subscribe"
      data-track-event="signup_submit">
  <input type="email" name="email" required>

  <!-- honeypot: bots fill it, humans never see it -->
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         class="hidden" aria-hidden="true">

  <button type="submit" :disabled="isLoading">Subscribe</button>

  <p x-show="isSuccess">Thanks!</p>
  <p x-show="isError" x-text="errorMessage"></p>
</form>
```

Every named field is serialized to a JSON object and POSTed to
`data-form-action`.

| Property | Meaning |
|---|---|
| `status` | `''`, `'loading'`, `'success'` or `'error'` |
| `isIdle` / `isLoading` / `isSuccess` / `isError` | booleans for `x-show` and `:disabled` |
| `errorMessage` | failure message; override the default with `data-error-message` |

The booleans exist because the CSP evaluator cannot evaluate a comparison like
`status === 'success'` — only a plain property lookup — so `x-show` needs
something that is already a boolean.

A field named `_gotcha` is a spam honeypot: if it has a value the component
reports success and sends nothing, and it is never included in the payload. An
optional `data-track-event` on the `<form>` fires through the `ryderTrack` path
above, on success only.

**CSP:** posting to another origin requires the action's host in `connect-src`,
or the browser blocks the request:

```toml
[params.csp]
  connectSrc = "https://api.example.com"
```

Same-origin actions need nothing; `connect-src 'self'` is always present.

#### Form fields

`ryderForm` is the engine; `utils/form-field.html` is the matching visual layer,
added in v0.4.0 so a themed form no longer means hand-writing the markup above:

```go-html-template
<form x-data="ryderForm" @submit.prevent="submit"
      data-form-action="https://api.example.com/subscribe">
  {{ partial "utils/form-field.html" (dict "name" "email" "type" "email"
      "label" "Email" "placeholder" "you@example.com" "required" true) }}
  {{ partial "utils/form-field.html" (dict "name" "message" "type" "textarea"
      "label" "Message" "help" "Anything else we should know?") }}

  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         class="hidden" aria-hidden="true">

  {{ partial "utils/form-field.html" (dict "type" "submit" "label" "Subscribe"
      "successMessage" "Thanks!" "errorMessage" "") }}
</form>
```

| Key | Meaning |
|---|---|
| `name` | Field name, and the default `id`. Required except for `submit` |
| `type` | Any text-like input type, plus `textarea` and `submit`. Defaults to `text` |
| `label` | Visible label; the button text when `type` is `submit` |
| `placeholder`, `value`, `autocomplete`, `rows` | Passed through when set |
| `required` | Marks the control required and appends `*` to the label |
| `help` | Hint text under the control, wired up via `aria-describedby` |
| `id`, `class` | Override the derived id, or append classes to the control |
| `successMessage` | `submit` only — a line shown on `x-show="isSuccess"` |
| `errorMessage` | `submit` only — a fixed message, or `""` to show the engine's own |

The submit button reuses the theme's default CTA class, so it follows
`params.colors.legacyAccents` along with every other CTA. The honeypot stays
hand-written: it is one line, and it should not look like a field.

### The dev-only linter

In `hugo.Environment == "development"` the theme also loads
`assets/js/cspLint.js`, which scans the rendered page for Alpine directives the
CSP evaluator cannot run — globals and arrow functions — and `console.warn`s
naming the offending element. It never loads in any other environment. Re-run it
by hand over dynamically rendered content with `__ryderCspLint()`.

### `assets/js/extended.js` — the custom-JS hook

For anything beyond the shipped components, **`assets/js/extended.js` is the
theme's sanctioned extension point.** In the theme it is a comment-only stub
imported by the last line of `assets/js/main.js`. Create the same path in your
own project:

```
your-site/assets/js/extended.js
```

Hugo's union asset filesystem gives your project's `assets/` precedence over the
theme's, so your file replaces the stub with no theme edit, no fork, and nothing
to re-merge on upgrade. (`exampleSite/assets/js/extended.js` in this repo does
exactly that.) Your code is bundled into `main.js` by the same `js.Build` call,
so imports, JSX-free ESM, and `node_modules` packages all work.

Because ES `import` statements are hoisted, **`extended.js` runs before
`Alpine.start()`** — early enough to register your own components. It runs before
`window.Alpine` is assigned, though, so register on the `alpine:init` event
rather than reaching for `window.Alpine` at the top level:

```js
// assets/js/extended.js
document.addEventListener('alpine:init', () => {
  window.Alpine.data('myWidget', () => ({
    open: false,
    toggle() { this.open = !this.open },
    // Read config off the element instead of inlining it in the template.
    init() { this.endpoint = this.$el.dataset.endpoint },
  }))
})
```

```html
<div x-data="myWidget" data-endpoint="/api/thing">
  <button @click="toggle">Toggle</button>
  <div x-show="open">…</div>
</div>
```

Add extra Font Awesome icons here too:

```js
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSmileWink } from '@fortawesome/free-regular-svg-icons'
library.add(faSmileWink)
```

---

## JavaScript Dependencies

`assets/js/main.js` imports `@alpinejs/csp`, `@alpinejs/focus`, `leaflet`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/free-brands-svg-icons`. They're declared in this theme's own `package.json` for the theme's dev loop and `exampleSite`, but **that is documentation, not an install mechanism** — Hugo's `js.Build` resolves imports from your site's **project root** `node_modules`, not the theme's. A theme consumed as a git submodule (or Hugo Module) is never `npm install`-ed itself, so you must install these packages at your own project root regardless of anything in the theme:

```bash
npm i @alpinejs/csp @alpinejs/focus leaflet \
  @fortawesome/fontawesome-svg-core \
  @fortawesome/free-solid-svg-icons \
  @fortawesome/free-regular-svg-icons \
  @fortawesome/free-brands-svg-icons
```

If they're missing, `hugo build`/`hugo server` prints a warning naming the missing packages and this same install command before `js.Build` fails (or, if you rely on dependency hoisting and the packages genuinely resolve from elsewhere, the warning is a harmless false positive and the build proceeds).

---

## Sites Using Ryder

- [benstrawbridge.com](https://www.benstrawbridge.com)
- [writingsos.com](https://www.writingsos.com)

Using Ryder? [Let us know](mailto:hello@arts-link.com?subject=ryder) to be added here.

---

## About

Ryder is an open source project by **[Arts-Link](https://www.arts-link.com)**, a small creative studio building tools and sites for writers, artists, bands, and independent publishers. It is actively maintained by **[Ben Strawbridge](https://www.benstrawbridge.com)**.

If Ryder is useful to you, check out [arts-link.com](https://www.arts-link.com) — and feel free to ⭐ the repo.

---

## Thanks

- [Hugo Discourse](https://discourse.gohugo.io/)
- [hugo-PaperMod](https://github.com/adityatelange/hugo-PaperMod)
- [hugo-theme-gallery](https://github.com/nicokaiser/hugo-theme-gallery)
