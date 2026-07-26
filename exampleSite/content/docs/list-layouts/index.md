+++
title = 'List Layouts'
date = 2026-07-26T10:00:00-07:00
description = 'A feed-less list layout for data-driven singleton sections, and the empty-data idiom partial that goes with it.'
homeFeatureIcon = "fa-solid fa-signs-post"
tags = ["layouts", "data"]
[menu]
 [menu.main]
  weight = 50
  parent = 'docs'
+++

`_default/list.html` is hardwired to paginate `.Pages` into a card grid — great
for a blog index, wrong for a section that is really a single page with no
children, sourced from a `data/*.json` file instead of child content.

<!--more-->

## `layout = "list-plain"`

Ship a section with title + `.Content` and nothing else — no pagination, no
card grid, no taxonomy cloud — by setting `layout` in its `_index.md` front
matter:

```toml
+++
title = "About"
layout = "list-plain"
+++
```

Hugo picks `_default/list-plain.html` over `_default/list.html` for that
section. This is Hugo's own template-selection mechanism (the `layout` front
matter field) rather than a theme-specific param, because unlike `headerType`
or `menuType` — which pick a *partial* included from within one fixed entry
template — Hugo has no other way to choose between two candidate top-level
list templates.

The [Press](../../press/) section on this exampleSite uses it: a page with no
children, its content sourced from `data/press.json`.

## `utils/data-items.html`

The "does this data file have anything in it" check —
`.Site.Data.press.items | default slice` — is easy to end up hand-rolling at
every call site that reads a `data/*.json` file shaped `{"items": [...]}`.
`utils/data-items.html` is a returning partial for it:

```go-html-template
{{ $items := partial "utils/data-items.html" "press" }}
{{ if gt (len $items) 0 }}
  ...
{{ end }}
```

It resolves `.Site.Data.<name>.items`, defaulting safely to an empty slice
when the data file or its `items` key doesn't exist — callers check `len()`
rather than testing for existence directly.

[Conditional menu entries](../menus/) reuse this exact partial: the Press nav
link above only renders because `data/press.json` has items.
