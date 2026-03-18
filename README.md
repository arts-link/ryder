[![exampleSite build](https://github.com/arts-link/ryder/actions/workflows/hugo.yml/badge.svg)](https://arts-link.github.io/ryder/)

# Ryder — A Hugo Theme

A Hugo theme built with TailwindCSS, Alpine.js, and Font Awesome. Intentionally barebones with practical defaults — drop it in and start writing.

Named after a late Rhodesian Ridgeback/Mastiff companion.

**[Live Demo →](https://arts-link.github.io/ryder/)**

---

## Quick Start

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
- **Card layouts** — multiple variants, configurable per section or globally
- **Featured grid** — promote any page to the homepage featured grid via front matter
- **Shortcodes** — alerts, maps, recipe schema, media embeds, CTAs, photo gallery, and more
- **Schema markup** — structured data for recipes (Schema.org/Recipe JSON-LD)
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
- [arts-link.com](https://www.arts-link.com)
- [writingsos.com](https://www.writingsos.com)
- [grrquarterly.com](https://www.grrquarterly.com)

Using Ryder? [Let us know](mailto:hello@arts-link.com?subject=ryder) to be added here.

---

## Thanks

- [Hugo Discourse](https://discourse.gohugo.io/)
- [hugo-PaperMod](https://github.com/adityatelange/hugo-PaperMod)
- [hugo-theme-gallery](https://github.com/nicokaiser/hugo-theme-gallery)
