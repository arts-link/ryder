+++
title = 'Menus'
date = 2024-01-26T15:22:11-08:00
tags = [
    "menus",
]
[menu]
 [menu.main]
  weight = 40
  name = 'Create a Menu'
  parent = 'docs'
+++

## This is one way to add a menu

I modified the default menu.html partial sample code from the hugo docs to use the tailwindcss `group-hover` syntax. I made the children menu inside a container div so it is a sibling to the main anchor and on hover it appears. Still needs style work.

<!--more-->

## Parent-item trigger modes

Parent menu items with children support two trigger modes:

- `caret` is the default. The menu label stays a normal link, and only the caret button opens the submenu.
- `button` turns the full parent row into the submenu trigger. In that mode the parent item does not link to its landing page.

Use a menu param to choose the behavior:

```toml
+++
[menu]
 [menu.main]
  identifier = "docs"
  name = "Docs"
  [menu.main.params]
    submenuTrigger = "button"
+++
```

If you omit `submenuTrigger`, Ryder uses `caret`.

I use front matter to create the simple menu here.

```md maintenance-page.md
+++
[menu]
 [menu.main]
  identifier = 'maintenance-page'
  weight = 22
+++
```

Then a child menu of that would use that identifier. On a page that will be in the main menu sub-nav. This system is not well suited to go beyond 1 level of depth, it works but becomes very unweildy in the actual nav.

```md maintenance-status.md
[menu]
 [menu.main]
  parent = 'maintenance-page'
  weight = 22
  name = 'random peace'
```
