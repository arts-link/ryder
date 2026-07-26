[![exampleSite build](https://github.com/arts-link/ryder/actions/workflows/hugo.yml/badge.svg)](https://arts-link.github.io/ryder/)

# Ryder — A Hugo Theme

A Hugo theme built with TailwindCSS, Alpine.js, and Font Awesome. Intentionally barebones with practical defaults — drop it in and start writing.

Named after a late Rhodesian Ridgeback/Mastiff companion.

**[Live Demo →](https://arts-link.github.io/ryder/)**

> An open source project by **[Arts-Link](https://www.arts-link.com)**, maintained by **[Ben Strawbridge](https://www.benstrawbridge.com)**.

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

---

## Features

- **Dark mode** — toggle built in, or follow system preference
- **Two-level mobile nav** — Alpine-powered hamburger menu with configurable submenu trigger behavior
- **Card layouts** — multiple variants, configurable per section or globally
- **Featured grid** — promote any page to the homepage featured grid via front matter
- **Shortcodes** — alerts, maps, recipe schema, media embeds, CTAs, photo gallery, and more
- **Image galleries** — page-bundle gallery layout or shortcode-driven gallery with lightbox
- **Schema markup** — structured data for recipes (Schema.org/Recipe JSON-LD)
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
  showHomeFeed = true            # Paginated feed on home page
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
replace it — `nav.html`'s own CSS lives on that class.) This is the pattern to
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

Configured via `data/social.json` (not params):

```json
{
  "main": [
    { "title": "GitHub", "name": "github", "icon": "fab fa-github", "link": "https://github.com/you", "weight": 10 }
  ]
}
```

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
  # extraDirectives = "worker-src 'none';"
```

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
| `amazon-associate-link` | Affiliate link with disclosure |
| `font-awesome` | Inline Font Awesome icon |
| `highlight-github` | GitHub-styled syntax highlight block |

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
| JSON-LD `BlogPosting` | Article authorship, dates, keywords, and full text for Google rich results and AI crawlers |
| JSON-LD `WebPage` + `Organization` | Homepage entity signals |
| JSON-LD `BreadcrumbList` | Section and category navigation trails for rich-result breadcrumbs |
| JSON-LD `Recipe` | Full recipe structured data (ingredients, steps, nutrition) when `recipe = true` |
| Dynamic OG image | Auto-generated Open Graph image with title text when no page image exists |

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
```

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

```bash
npm run watch-tw    # Watch mode
npm run build-tw    # Build
npm run deploy-tw   # Build + minify for production
```

The theme's own `hugo.toml` sets `[build] writeStats = true` plus cachebusters for `tailwind.config.js`/`postcss.config.js`/`assets/**`, and consuming sites inherit both (theme config merges into the site's; your own `[build]` block, if you set one, still wins). This writes `hugo_stats.json` to your project root on every build — add it to `.gitignore`, or track it deliberately if you rely on reproducing exact Tailwind class-discovery output across clones.

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
