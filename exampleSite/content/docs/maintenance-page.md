+++
title = 'Maintenance Page'
date = 2026-03-23T22:00:00-07:00
description = 'Use the hidden-home layout to put up a focused maintenance or coming-soon page.'
[menu]
 [menu.main]
  weight = 35
  parent = 'docs'
+++

## What it is for

Ryder ships with a `hidden-home` layout for times when you want to put a simple maintenance or coming-soon screen in front of your site without building a separate template. It gives you:

- a full-screen background image
- the Ryder logo
- your page content in a centered translucent panel
- social links in the footer area

The example page for this layout now lives at [`/maintenance-page/`](../../maintenance-page/).

<!--more-->

## Create a maintenance page

Add a content file like this:

```toml
+++
title = "Maintenance Page"
type = "hidden-home"
+++
```

Then add your message in the body. For example:

```md
We are updating the site right now.

Please check back soon.
```

The layout looks for a background image at `static/images/hidden-home-cover.webp`, so adding that file is the quickest way to brand the page.

## How to trigger it

There are two straightforward ways to use it:

1. Create a standalone page with `type = "hidden-home"` and share or redirect traffic to that page while you work.
2. Temporarily turn your homepage into the maintenance page by setting `type = "hidden-home"` in `content/_index.md`.

The second option is already hinted at in the example site homepage front matter, where the line is currently commented out.

## Notes

- This is a presentation layer, not an access-control system. Search engines and direct URLs can still reach other pages unless you add redirects or server rules.
- The page is intentionally minimal, so it works well for maintenance notices, launch countdowns, or temporary holding pages.
