+++
title = 'CSS Overrides and Visual Customization'
date = 2024-06-15T10:00:00-07:00
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

All overrides live under `[params.twClasses]` in your `hugo.toml`.

---

## Header appearance

The header uses two layers: an outer frame (background color, border, text color) and an inner frame (optional background image with height and position).

```toml
[params.twClasses]
  headerBackgroundFrameOuter = "bg-gradient-to-r from-slate-900 to-slate-700 border-b border-fuchsia-600 text-neutral-100"
  headerBackgroundFrameInner = "bg-[url('/images/your-header-photo.jpg')] h-[350px] bg-cover bg-[center_40%]"
```

### `headerBackgroundFrameOuter`

Controls the header's outermost wrapper — background color or gradient, border, and text color.

| Example class | Effect |
|---|---|
| `bg-slate-900` | Solid dark background |
| `bg-gradient-to-r from-slate-900 to-slate-700` | Horizontal gradient |
| `border-b border-fuchsia-600` | Bottom border in accent color |
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
headerBackgroundFrameOuter = "... border-b border-fuchsia-600 ..."
```

Change `border-fuchsia-600` to any Tailwind color class. For no border, omit both `border-b` and the color class.

---

## Scanning custom class strings

TailwindCSS JIT only generates CSS for classes it can detect at build time. Classes you add in `hugo.toml` are scanned automatically — but **arbitrary value classes** like `bg-[url(...)]` or `h-[400px]` must appear literally in a file that Tailwind scans.

The theme's `tailwind.config.js` already includes your config and content directories. If you're adding completely new arbitrary values and they aren't rendering, verify the file path is listed in the `content` array of `tailwind.config.js` and rebuild CSS with:

```bash
npm run deploy-tw
```
