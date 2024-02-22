+++
title = 'Menus'
date = 2024-01-26T15:22:11-08:00
tags = [
    "menus",
]
[menu]
 [menu.main]
  weight = 2
  name = 'Create a Menu'
  parent = 'posts'
# draft = true
+++

I modified the default menu.html partial sample code from the hugo docs to use the tailwindcss `group-hover` syntax. I made the children menu inside a container div so it is a sibling to the main anchor and on hover it appears. Still needs style work.

I use front matter to create the simple menu here.

```md peaceful.md
+++
[menu]
 [menu.main]
  identifier = 'peaceful'
  weight = 22
+++
```

Then a child menu of that would use that identifier. On a page that will be in the main menu sub-nav. This system is not well suited to go beyond 1 level of depth, it works but becomes very unweildy in the actual nav.

```md randomly-peaceful.md
[menu]
 [menu.main]
  parent = 'peaceful'
  weight = 22
  name = 'random peace'
```