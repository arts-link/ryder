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
cp themes/ryder/exampleSite/*.config.js .
npm install

# !! Delete the line `themesDir = "../.."` from config/_default/hugo.toml
# !! Update baseURL in config/_default/hugo.toml to your own URL

# Create a home page and start the server
hugo new content _index.md
hugo server -D
```

---

## Requirements

- Hugo 0.146+
- Node.js / npm

---

## Features

- **Dark mode** — toggle built in, or follow system preference
- **Two-level mobile nav** — Alpine-powered hamburger menu with configurable submenu trigger behavior
- **Card layouts** — multiple variants, configurable per section or globally
- **Featured grid** — promote any page to the homepage featured grid via front matter
- **Shortcodes** — alerts, maps, recipe schema, media embeds, CTAs, photo gallery, and more
- **Image galleries** — page-bundle gallery layout or shortcode-driven gallery with lightbox
- **SEO & GEO built-in** — full JSON-LD structured data, Open Graph, Twitter Cards, and dynamic OG image generation on every page (see [SEO & GEO](#seo--geo))
- **Privacy-friendly analytics** — Plausible integration
- **Custom RSS feed** — styled XSLT browser-readable feed
- **Social links** — footer social icons via `data/social.json`
- **i18n** — partial translations for English, German, French
- **Template variants** — header, footer, menu, and card partials support `-fun` and custom suffix variants
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
cp themes/ryder/exampleSite/*.config.js .
npm install
```

**Important:** Delete the line `themesDir = "../../"` from `config/_default/hugo.toml` — it exists only for theme development and will break your site.

---

## Configuration

Full example in [`exampleSite/config/_default/hugo.toml`](https://github.com/arts-link/ryder/blob/main/exampleSite/config/_default/hugo.toml).

### Key Parameters

```toml
[params]
  showDarkToggle = true          # Dark mode toggle
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
  headerBackgroundFrameOuter = "bg-gradient-to-r from-slate-900 to-slate-700 text-neutral-100"
  headerBackgroundFrameInner = "bg-cover h-[300px]"
  footerBackground = ""          # Falls back to headerBackgroundFrameOuter

[params.author]
  name = "Your Name"
  email = "you@example.com"
```

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

### Analytics (Plausible)

```toml
[services.plausibleAnalytics]
  ID = "yourdomain.com"
```

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
| `photo-gallery` | Alpine.js lightbox gallery |
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

### Image Galleries

Ryder supports galleries in two forms:

1. A page-bundle gallery page using `type = "photo-gallery"`
2. A reusable `photo-gallery` shortcode for images stored in a shared asset path

Minimal gallery page:

```toml
+++
title = "Gallery"
type = "photo-gallery"
+++
```

Create that page as a leaf bundle and place your images beside `index.md`.

Shortcode example:

```go-html-template
{{</* photo-gallery
  path="images/ryder-gallery"
  title="Ryder Gallery"
*/>}}
```

See the example docs page and live sample:
- [`exampleSite/content/docs/image-galleries.md`](https://github.com/arts-link/ryder/blob/main/exampleSite/content/docs/image-galleries.md)
- [`exampleSite/content/ryder-gallery/index.md`](https://github.com/arts-link/ryder/blob/main/exampleSite/content/ryder-gallery/index.md)

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
  og_image_default = "images/og-default.webp"   # Base image for generated OG cards

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

If a page has no `feature*`, `cover*`, or `thumbnail*` image in its bundle, Ryder generates an Open Graph image at build time by overlaying the page title and site name onto your `og_image_default` base image. The result is a static `.webp` baked into your build — no server-side rendering.

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
headerType = "-fun"   # loads header-fun.html
footerType = "-fun"
menuType = "-fun"
listCardType = "-super-simple"
```

---

## CSS Development

```bash
npm run watch-tw    # Watch mode
npm run build-tw    # Build
npm run deploy-tw   # Build + minify for production
```

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
