+++
title = 'Using Font Awesome Icons'
date = 2024-06-01T10:00:00-07:00
homeFeatureIcon = "fa-solid fa-wand-magic-sparkles"
tags = ["hugo","icons","font-awesome"]
[menu]
 [menu.main]
  weight = 5
  parent = 'posts'
+++

## How icons work in this theme

The theme uses Font Awesome with tree-shaking — only the icons explicitly imported in `assets/js/main.js` are included in the JavaScript bundle. If you use an icon class in front matter or a template and it hasn't been imported, it will silently render nothing.

<!--more-->

## Using an icon

Set `homeFeatureIcon` in front matter to any Font Awesome class string:

```toml
homeFeatureIcon = "fa-solid fa-bowl-food"
```

Icons also work in alert shortcodes:

```toml
[[params.alphaAlert]]
  alertIconClass = "fa-solid fa-camera-retro"
```

## Adding a new icon

If the icon you want isn't rendering, it needs to be added to `assets/js/main.js`.

**Step 1** — Find the camelCase import name. The pattern is straightforward:

| Class | Import name |
|---|---|
| `fa-bowl-food` | `faBowlFood` |
| `fa-map-location-dot` | `faMapLocationDot` |
| `fa-github-alt` | `faGithubAlt` (brand) |

**Step 2** — Add it to the correct import block in `assets/js/main.js`:

```js
// Solid icons
import {
  ...,
  faBowlFood,   // ← add here, keep alphabetical
} from '@fortawesome/free-solid-svg-icons'

// Brand icons (GitHub, Spotify, YouTube, Amazon, etc.)
import {
  faAmazon,
} from '@fortawesome/free-brands-svg-icons'
```

**Step 3** — Add it to `library.add(...)`:

```js
library.add(
  faBowlFood, faBullhorn, ...
)
```

## Icon sets

| Set | Import from | Prefix |
|---|---|---|
| Solid (filled) | `@fortawesome/free-solid-svg-icons` | `fa-solid` |
| Regular (outline) | `@fortawesome/free-regular-svg-icons` | `fa-regular` |
| Brands | `@fortawesome/free-brands-svg-icons` | `fa-brands` |

Check [fontawesome.com/icons](https://fontawesome.com/icons) and filter by **Free** to confirm an icon is available before adding it.

## Finding icons in the free set

Not all Font Awesome icons are free. Before adding one, search on fontawesome.com and look for the **Free** badge. Pro-only icons will import without error but render nothing at runtime.
