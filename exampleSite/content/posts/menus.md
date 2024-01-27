+++
title = 'Menus'
date = 2024-01-26T15:22:11-08:00
[menu]
 [menu.main]
  weight = 52
  name = 'Create a Menu'
  parent = 'posts'
# draft = true
+++

I use front matter in this blog to create the simple menu here.

I modified it to use the tailwindcss `group-hover` syntax. I made the children menu inside a container div so it is a sibling to the main anchor and on hover it appears. Still needs style work.

```go
+++
[menu]
 [menu.main]
  weight = 32
  name = 'About Hugo on the Menu'
+++
```
