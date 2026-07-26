+++
title = "Press"
description = "Press mentions, sourced entirely from data/press.json — demonstrates layout = \"list-plain\" and the utils/data-items.html partial."
layout = "list-plain"
+++

Selected press coverage of the Ryder theme, sourced entirely from `data/press.json`. This section has no child pages, so `_default/list.html`'s pagination and card grid would be dead weight here — this page sets `layout = "list-plain"` in its front matter instead: title + this text, nothing else.

{{< press-list >}}

See [List Layouts](../docs/list-layouts/) for how `list-plain` and the `utils/data-items.html` partial work together, and how this nav entry itself is gated on `data/press.json` having content.
