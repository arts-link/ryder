+++
title = 'Custom navClass'
date = 2026-07-26
description = 'Restyle the nav on a single page with navClass, without forking header.html into a new headerType variant.'
categories = ['docs']
tags = ['css', 'hugo']
navClass = "main-menu-nav bg-fuchsia-900/40 rounded-full px-3"
+++

**This page sets `navClass` in its own front matter.** The nav above sits in a translucent fuchsia pill, on this page only. Navigate anywhere else and it returns to normal.

<!--more-->

## The problem it solves

`headerType` swaps the *entire* header template. If all you want is a different nav treatment on one page — a dark variant on the home page, a pill on a landing page — you previously had to copy `header.html` into `header-whatever.html`, change a class, and maintain a second full template forever.

That fork also costs you the things `header.html` does for free: two-level menus, `submenuTrigger`, and Hugo's `IsMenuCurrent` / `HasMenuCurrent` active-state handling.

## Usage

Set `navClass` in front matter for a single page:

```toml
+++
title = 'Landing'
navClass = "main-menu-nav bg-fuchsia-900/40 rounded-full px-3"
+++
```

Or set a site-wide default in `hugo.toml`, which any page can then override:

```toml
[params.twClasses]
  nav = "main-menu-nav"
```

`header.html` resolves `navClass` first, then `twClasses.nav`, and passes the result into the menu partial. When neither is set, `menu.html` applies its own default of `main-menu-nav`.

## Resolution order

| Source | Scope | Wins over |
|---|---|---|
| `navClass` in front matter | One page | everything below |
| `params.twClasses.nav` | Site-wide | the built-in default |
| `menu.html` default | Fallback | — |

Include `main-menu-nav` in your value unless you intend to drop the base nav styling entirely — the classes replace the default rather than appending to it.

## When you still need a variant

`navClass` covers appearance. Reach for a `headerType` variant only when the header's *structure* differs — a different logo placement, an extra element, a different markup order. If the difference is expressible in classes, use this instead.

This is the "one variant plus `.Param` for the skin" pattern: keep a single `header.html`, and let pages skin it.

## Related

- [List Layouts](../list-layouts/) — `layout = "list-plain"` and data-driven sections
- [CSS Overrides](../css-overrides/) — `twClasses.body`, `.site-shell`, and the extended stylesheet hook
