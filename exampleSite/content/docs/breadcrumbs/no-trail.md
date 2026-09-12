+++
title = "Trail Turned Off"
description = "The same depth as its sibling, with showBreadCrumbs = false — no visible trail, and no BreadcrumbList in the markup either."
date = 2026-09-11T09:30:00-08:00
homeFeatureIcon = "fa-solid fa-xmark"
showBreadCrumbs = false
tags = ["breadcrumbs","navigation"]
+++

This page sits exactly where [Three Levels Deep](../three-levels-deep/) sits — three crumbs' worth of ancestry — but sets `showBreadCrumbs = false` in its front matter, so there is nothing above the title.

The flag does both halves. It hides the visible trail **and** suppresses the `BreadcrumbList` JSON-LD, so the markup never describes navigation a visitor cannot see. Before v0.5.0 the structured data ignored the flag entirely and a page like this still claimed a trail.

Set it per page in front matter, as here, or site-wide in `hugo.toml` under `[params]`.
