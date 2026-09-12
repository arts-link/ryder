+++
title = "Three Levels Deep"
description = "A page nested two sections down, so its breadcrumb trail has something to say."
date = 2026-09-11T09:00:00-08:00
homeFeatureIcon = "fa-solid fa-bars"
tags = ["breadcrumbs","navigation"]
+++

Look at the top of this page: `Home » Docs » Breadcrumbs`. Three crumbs, none of them a link to this page.

The last crumb is this page's **parent section**, not this page. Hugo's `.Ancestors` excludes the page itself, so the trail is built from what is above you and stops there. The page you are on is named by the `<h1>` a few pixels below — repeating it as a self-link added a heading and a dead link and told a visitor nothing.

The JSON-LD is not quite the same shape. Its `BreadcrumbList` *does* carry this page as a final `ListItem`, but with a `name` and no `item` — the standard pattern for the page you are already on, and what keeps a breadcrumb rendering under the search result. View source and compare.

Go back up: [Breadcrumbs](../) is one level, [Docs](/docs/) is two.
