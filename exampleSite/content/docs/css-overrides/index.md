+++
title = 'CSS Overrides and Visual Customization'
date = 2024-06-15T10:00:00-07:00
description = 'Customize the header, footer, card colors, and border accents from hugo.toml without editing theme files.'
homeFeature = true
homeFeatureTitle = "CSS Overrides"
homeFeatureIcon = "fa-solid fa-wand-magic-sparkles"
categories = ["home-page"]
tags = ["css", "tailwind", "customization", "theming"]
hideAsideBar = true
[menu]
 [menu.main]
  weight = 10
  parent = 'docs'
+++

Control the header image, footer background, card colors, and border accents — all from your `hugo.toml` without touching theme files.

<!--more-->

## How CSS overrides work

The Ryder theme reads TailwindCSS class strings from your config and applies them directly to layout elements. This lets you customize colors, backgrounds, gradients, and spacing using any Tailwind utility class — including [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values) for things like custom image URLs or pixel measurements.

Class-string overrides live under `[params.twClasses]` in your `hugo.toml`. They
are the escape hatch — total control, one element at a time. For color, reach
for the token layer below first: it repoints the whole theme at once, including
the parts no `twClasses` param exposes.

---

## Color tokens

*New in v0.4.0.*

The theme's colors resolve through CSS custom properties, so you can repoint the
palette without overriding a single class string. Four semantic roles:

| Token | Default | Tailwind | Used by |
|---|---|---|---|
| `brand` | `7 89 133` | sky-800 | logo word 1, nav links, article meta icons, blockquote rule |
| `brand-alt` | `63 98 18` | lime-800 | logo word 2, active nav entry |
| `accent` | `244 63 94` | rose-500 | aside icons, tag chips, tag cloud, CTA ring |
| `chrome-from` / `chrome-to` | `15 23 42` / `51 65 85` | slate-900 / slate-700 | *declared only* — see below |

```toml
[params.colors]
  brand     = "12 74 110"    # sky-900
  brand-alt = "54 83 20"     # lime-900
  accent    = "217 70 239"   # fuchsia-500
```

### `chrome-from` and `chrome-to` are declared, not wired

They exist in the preset so you can use `from-ryder-chrome-from` /
`to-ryder-chrome-to` in your own class strings. **Nothing in the theme reads
them.** The header and footer gradients arrive through
`twClasses.headerBackgroundFrameOuter`, which stays a literal Tailwind string
for the reason given below — so setting `chrome-from` does not retint your
header. Change the gradient in `headerBackgroundFrameOuter` itself.

### Values are RGB channels, not hex

`"244 63 94"`, **not** `"#f43f5e"`. This is not a style preference. A hex value
inside `var()` works for `text-`, `bg-`, and `border-`, then silently produces
nothing for every opacity modifier — `border-ryder-accent-300/80`,
`dark:bg-ryder-accent-950/40` — with no build error to tell you. Space-separated
channels interpolate with Tailwind's `<alpha-value>` and keep the modifiers
working. A value in any other format is ignored with a build warning.

To convert: `#f43f5e` → `f4`=244, `3f`=63, `5e`=94 → `"244 63 94"`.

### The ramp

Each of `brand`, `brand-alt`, and `accent` carries a full 50–950 ramp, because
the theme uses more than one shade of each — the nav alone spans `brand-100`
through `brand-800`.

Setting the bare token moves **only that family's canonical step**, and the
canonical step differs per family: `brand` aliases `brand-800`, `brand-alt`
aliases `brand-alt-800`, `accent` aliases `accent-500`. Every other step keeps
its default.

That matters more than it sounds. The default CTA button uses
`accent-600` / `accent-500` / `accent-300` for its border, hover, and focus
ring — so setting `accent` alone moves the hover and leaves the border and ring
rose. **Set every step a component actually uses:**

```toml
[params.colors]
  accent     = "217 70 239"   # ryder-accent + ryder-accent-500 (chip hover, aside icons)
  accent-50  = "253 244 255"  # tag chip light fill
  accent-300 = "240 171 252"  # tag chip border, CTA focus ring
  accent-600 = "192 38 211"   # CTA border, tag chip hover border
  accent-950 = "74 4 78"      # tag chip dark-mode fill
```

Anything you leave unset keeps the theme default, so a partial override is safe
— it just won't be a complete one. Grep the theme for the family you're
repointing (`rg 'ryder-accent-' layouts assets/css`) to see every step in use.

### Using the tokens in your own classes

The preset exposes them as ordinary Tailwind colors, usable anywhere a class
string is accepted — including `twClasses`:

```
text-ryder-brand        bg-ryder-accent-50    border-ryder-brand-alt-800
from-ryder-chrome-from  to-ryder-chrome-to    ring-ryder-accent-300/80
```

Note that `twClasses` values you set are literal strings under your control; the
theme's own shipped defaults deliberately stay on plain Tailwind classes so a
config copied from the docs never depends on the token layer.

### What is not tokenized

Surfaces (`neutral-*`), structural greys (`slate-500` labels, `slate-200/80`
borders), the alert color triples, and the Amazon/Spotify button fills. The
alert colors carry *meaning* — yellow is "warning", not decoration — and the
platform fills belong to those platforms. Repointing either would be a bug, not
a theme.

---

## Page shell

### `body` and `bodyDark`

The `<body>` classes are configurable, so you can change the page background,
text color, or font without overriding `baseof.html`:

```toml
[params.twClasses]
  body = "bg-amber-50 text-stone-800 font-sans"
  bodyDark = "dark:bg-stone-950 dark:text-amber-50"
```

| Param | Default | Notes |
|---|---|---|
| `body` | `bg-neutral-100 text-neutral-900 font-titillium` | Replaces the base classes outright |
| `bodyDark` | `dark:bg-neutral-900 dark:text-neutral-100` | Only emitted when `darkMode` is not `"off"` |

They are two params rather than one so that changing your body font can't
silently switch dark mode off — and so a site with `darkMode = "off"` never
receives `dark:` variants no matter what it sets here.

### The `site-shell` hook

`<body>` contains exactly one element child: a wrapper `<div>` carrying the
`site-shell` class. Target it from your own CSS instead of writing brittle
selectors against `body`'s children:

```css
/* do this */
.site-shell { … }

/* not this */
body > div:first-child { … }
```

`site-shell` is `position: relative`, so absolutely-positioned descendants
resolve against the shell rather than the viewport.

---

## Header appearance

The header uses two layers: an outer frame (background color, border, text color) and an inner frame (optional background image with height and position).

```toml
[params.twClasses]
  headerBackgroundFrameOuter = "bg-gradient-to-r from-slate-900 to-slate-700 border-b border-rose-500 text-neutral-100"
  headerBackgroundFrameInner = "bg-[url('/images/your-header-photo.jpg')] h-[350px] bg-cover bg-[center_40%]"
```

### `headerBackgroundFrameOuter`

Controls the header's outermost wrapper — background color or gradient, border, and text color.

| Example class | Effect |
|---|---|
| `bg-slate-900` | Solid dark background |
| `bg-gradient-to-r from-slate-900 to-slate-700` | Horizontal gradient |
| `border-b border-rose-500` | Bottom border in accent color |
| `text-neutral-100` | Light text for dark backgrounds |

### `headerBackgroundFrameInner`

Controls the inner content area, primarily used for a background photo. The height determines how much of the image is visible; `bg-[center_30%]` shifts the crop point vertically.

| Example class | Effect |
|---|---|
| `bg-[url('/images/photo.jpg')]` | Set a background image |
| `h-[350px]` | Fixed height in pixels |
| `bg-cover` | Scale image to fill the area |
| `bg-[center_30%]` | Crop from 30% down the image |
| `bg-[center_50%]` | Crop from the vertical center |

**Tip:** For images deployed at a subpath (e.g. `https://example.com/mysite/`), include the subpath in the URL: `bg-[url('/mysite/images/photo.jpg')]`.

---

## Footer background

By default the footer inherits `headerBackgroundFrameOuter`. To use a different footer background, set `footerBackground`:

```toml
[params.twClasses]
  footerBackground = "bg-neutral-900 text-neutral-100"
```

---

## Article and featured card backgrounds

Apply a background color or gradient to individual article pages and to the featured card on the home page:

```toml
[params]
  articleBackgroundStyle = "bg-gradient-to-l from-blue-50 to-green-50"
  featuredArticleBackgroundStyle = "bg-gradient-to-l from-yellow-100 to-lime-100"
```

These accept any Tailwind background class. Leave them unset (or commented out) for no article background.

---

## Card category colors

Cards in list views use a gradient derived from the section or category. Set a site-wide default:

```toml
[params]
  cardCategoryColorsDefault = "bg-gradient-to-r from-sky-400 to-blue-500"
```

Override on a per-section or per-category basis by adding a `cascade` block to the section's `_index.md`:

```toml
# content/my-section/_index.md
[cascade]
  cardCategoryColorsDefault = "bg-gradient-to-r from-red-500 to-orange-500"
```

---

## Border and accent colors

Border colors are set as part of `headerBackgroundFrameOuter`. The `border-b` and `border-{color}` classes together control the bottom border line:

```toml
headerBackgroundFrameOuter = "... border-b border-rose-500 ..."
```

Change `border-rose-500` to any Tailwind color class. For no border, omit both `border-b` and the color class.

This was `border-fuchsia-600` through v0.3.x. v0.4.0 moved the header edge onto
the theme accent — see [Color tokens](#color-tokens) below, and the [v0.4.0
migration guide](https://github.com/arts-link/ryder/blob/main/docs/migration/v0.4.0.md).
Because this is your config rather than theme internals, `legacyAccents` does
not reach it: if you already set `headerBackgroundFrameOuter` yourself, nothing
changed for you.

---

## Scanning custom class strings

TailwindCSS JIT only generates CSS for classes it can detect at build time. Classes you add in `hugo.toml` are scanned automatically — but **arbitrary value classes** like `bg-[url(...)]` or `h-[400px]` must appear literally in a file that Tailwind scans.

Your site's `tailwind.config.js` owns the `content` array — the theme ships only
a preset (`tailwind.preset.js`), which carries design tokens and deliberately no
content globs, since those resolve from your project root. If you add
arbitrary values and they aren't rendering, verify the file path is listed in
your own `content` array, then restart the build:

```bash
hugo server
```

There is no separate CSS build command. Tailwind runs inside the Hugo build via
`css.PostCSS`.
