+++
title = "Releases"
description = "Ryder's tagged releases, sourced from data/releases.json — demonstrates layout = \"list-plain\", the utils/data-items.html partial, and a menu entry gated with hideIfEmptyData."
layout = "list-plain"
homeFeatureIcon = "fa-solid fa-tags"
[menu]
 [menu.main]
  weight = 52
  parent = 'docs'
  [menu.main.params]
   hideIfEmptyData = 'releases'
+++

Ryder's tagged releases, sourced entirely from `data/releases.json`. This section has no child pages, so `_default/list.html`'s pagination and card grid would be dead weight — it sets `layout = "list-plain"` in front matter instead: title, this text, and nothing else.

{{< releases-list >}}

**This page's menu entry is gated.** `hideIfEmptyData = 'releases'` under `[menu.main.params]` means the Docs entry renders only while `data/releases.json` has items. Empty that file and the link disappears — appropriate here, because a Releases link with nothing behind it is a dead end.

[Showcase](../showcase/) makes the opposite choice. See [List Layouts](../list-layouts/) for how `list-plain` and `utils/data-items.html` work together.
