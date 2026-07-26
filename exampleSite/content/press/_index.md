+++
title = "Press"
description = "Press mentions, sourced entirely from data/press.json — demonstrates layout = \"list-plain\" and the utils/data-items.html partial."
layout = "list-plain"
navClass = "main-menu-nav bg-fuchsia-900/40 rounded-full px-3"
+++

Selected press coverage of the Ryder theme, sourced entirely from `data/press.json`. This section has no child pages, so `_default/list.html`'s pagination and card grid would be dead weight here — this page sets `layout = "list-plain"` in its front matter instead: title + this text, nothing else.

{{< press-list >}}

See [List Layouts](../docs/list-layouts/) for how `list-plain` and the `utils/data-items.html` partial work together, and how this nav entry itself is gated on `data/press.json` having content.

This page also sets `navClass` in its front matter — a translucent fuchsia
pill behind the nav, visible only here — purely to demonstrate the
[one variant plus `.Param` for the skin](https://github.com/arts-link/ryder#one-variant-plus-param-for-the-skin)
pattern: no `header-*.html` fork required to restyle just the nav on one page.
