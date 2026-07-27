+++
title = "Releases"
description = "Ryder releases, sourced entirely from data/releases.json — demonstrates layout = \"list-plain\" and the utils/data-items.html partial."
layout = "list-plain"
+++

Ryder's tagged releases, sourced entirely from `data/releases.json`. This section has no child pages, so `_default/list.html`'s pagination and card grid would be dead weight here — this page sets `layout = "list-plain"` in its front matter instead: title, this text, and nothing else.

{{< releases-list >}}

See [List Layouts](../docs/list-layouts/) for how `list-plain` and the `utils/data-items.html` partial work together, and how this nav entry itself is gated on `data/releases.json` having content.
