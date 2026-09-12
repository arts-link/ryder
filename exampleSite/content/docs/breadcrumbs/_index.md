+++
title = "Breadcrumbs"
description = "How the breadcrumb trail decides what to render — and why a top-level page shows none at all."
homeFeatureIcon = "fa-solid fa-angles-right"
tags = ["breadcrumbs","navigation"]

[menu]
 [menu.main]
  weight = 54
  parent = 'docs'
+++

The trail is **Home plus the page's ancestors**, and it renders only when the page has a parent that isn't Home. It does not end in the page you are already on.

That last part is the change in v0.5.0. The trail used to close with a link to the current page, sitting directly above the `<h1>` saying the same words — a link to nowhere under a duplicated heading. On a top-level page the whole thing collapsed to `Home »` plus that self-link, which is not navigation.

| Page | Ancestors | Trail |
|---|---|---|
| Home | 0 | *none* |
| `/docs/` | 1 | *none* — nothing above it but Home |
| `/docs/breadcrumbs/` | 2 | `Home » Docs` |
| `/docs/breadcrumbs/three-levels-deep/` | 3 | `Home » Docs » Breadcrumbs` |

**This page is the second row.** Its own child, [Three Levels Deep](three-levels-deep/), is the third — open it and the trail above grows by one.

Turn the whole thing off with `showBreadCrumbs = false`, per site or per page. That also stops the matching `BreadcrumbList` JSON-LD, so the markup never claims a trail the page does not show.
