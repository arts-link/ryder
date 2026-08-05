+++
title = "Empty Section"
description = "A section with no pages in it — demonstrates the empty state that layouts/_default/list.html renders instead of a blank grid and a dead pager."
homeFeatureIcon = "fa-solid fa-signs-post"
[menu]
 [menu.main]
  parent = 'docs'
  weight = 95
+++

**This section is empty on purpose.** There are no pages under it, so the
paginator yields nothing and `layouts/_default/list.html` renders its empty
state below instead of an empty grid followed by pagination controls for a
single page of nothing.

It is the third of the theme's three answers to "nothing here", and the only
one that needs no configuration:

| Behaviour | Mechanism | When it fits |
|---|---|---|
| The menu entry disappears | `hideIfEmptyData` under the entry's `params` | A link with nothing behind it is a dead end — see [Releases](/docs/releases/) |
| The page stays and explains itself | `dataSource` + `emptyDataMessage` on a `list-plain` page | A vanished entry looks like a removed feature — see [Showcase](/docs/showcase/) |
| The list says so itself | *nothing — this page* | A real section that simply has no posts yet |

The wording comes from `i18n/` (`emptyListTitle`, `emptyListBody`), so it is
translated rather than configured. Override it there.
