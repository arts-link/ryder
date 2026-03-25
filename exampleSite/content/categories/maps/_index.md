+++
title = 'Maps'
date = 2024-05-29T22:58:56-07:00
description = 'Pages featuring interactive Leaflet and OpenStreetMap integrations for Hugo.'
paginate = 72
tags = [
  "maps"
  ]
[cascade]
  sectionTitle = "Maps on BenStrawbridge.com"
  homeFeatureIcon = "fa-solid fa-map-location-dot"
  cardCategoryColorsDefault = "bg-gradient-to-r from-red-500 to-orange-500"
  [cascade.params.twClasses]
    headerBackgroundFrameOuter = "bg-gradient-to-r from-red-500 to-orange-500 text-neutral-100"
[menu]

+++

## Custom Category and Tag Pages

Hugo automatically generates list pages for every taxonomy term — every category and tag gets its own URL. By default these pages just show a list of matching posts, but you can customize them fully by creating an `_index.md` file for any term.

This page is an example. It lives at `content/categories/maps/_index.md` and controls everything you see here: the title, header color, card colors, and this description.

<!--more-->

## How to create one

Create a directory matching the taxonomy path inside `content/`, then add an `_index.md`:

```
content/
  categories/
    maps/
      _index.md   ← this file
  tags/
    breakfast/
      _index.md   ← same pattern for tags
```

## Front matter options

The most useful field is `[cascade]` — any params set there are inherited by every page that belongs to this term, without touching those pages individually.

{{< highlight toml >}}
+++
title = 'Maps'
date = 2024-05-29T22:58:56-07:00

[cascade]
  homeFeatureIcon = "fa-solid fa-map-location-dot"
  cardCategoryColorsDefault = "bg-gradient-to-r from-red-500 to-orange-500"
  [cascade.params.twClasses]
    headerBackgroundFrameOuter = "bg-gradient-to-r from-red-500 to-orange-500 text-neutral-100"
+++
{{< /highlight >}}

| Field | What it does |
|---|---|
| `cardCategoryColorsDefault` | TailwindCSS classes applied to the card header for all posts in this term |
| `homeFeatureIcon` | Font Awesome icon class shown on cards and the page title |
| `headerBackgroundFrameOuter` | Overrides the header background for all pages in this term via cascade |
| `sectionTitle` | Optional label used in some card and list layouts |

## Tag pages work the same way

```
content/
  tags/
    breakfast/
      _index.md
```

Same structure, same front matter. Hugo treats categories and tags identically for taxonomy list pages — the only difference is the URL path.

## Body content

Any Markdown you write in the body of the `_index.md` appears above the list of posts, as you're reading now. Keep it short — a sentence or two explaining what the term covers is enough. The `<!--more-->` tag controls what appears as the summary on cards.
