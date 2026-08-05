+++
title = 'Design System'
date = 2026-08-04T09:00:00-07:00
description = 'Ryder’s colour tokens, type scale, spacing, and components — documented by the live theme rather than a screenshot of it.'
homeFeature = true
homeFeatureTitle = "Design System"
homeFeatureIcon = "fa-solid fa-swatchbook"
categories = ["home-page"]
tags = ["design", "tailwind", "tokens", "theming", "components"]
showToc = true
[menu]
 [menu.main]
  weight = 5
  parent = 'docs'
+++

Every preview on this page is the real component, rendered by the same partial
your site calls. Nothing here is a mockup, so nothing here can drift.

<!--more-->

That is the whole point of documenting a theme from inside itself. A
hand-maintained page of static markup is wrong the first time someone edits a
partial, and wrong *invisibly*. This page inherits the real dark mode, the real
table of contents, and the real aside — because it is a normal page of the
site it documents.

Values quoted below come from `data/design-system.json`, so each one exists in
exactly one place. The reasoning behind the system — why rose is the accent,
why tokens are channels rather than hex — lives in
[`docs/design-decisions.md`](https://github.com/arts-link/ryder/blob/main/docs/design-decisions.md)
in the repository, because it is maintainer-facing and does not belong in a
site build.

---

# Foundations

## Overview

Three commitments shape everything else.

**Tailwind, barely extended.** `tailwind.preset.js` adds a colour token
namespace, two breakpoints (`xs`, `3xl`), a font family that resolves through a
custom property, and four background images. That is all. Ryder does not ship a
parallel design language on top of Tailwind — if you know Tailwind, you know
this theme.

**Config is the API.** Colours, header and footer classes, body classes, fonts,
menus, and card gradients are all reachable from `hugo.toml`. Overriding a
template should be a last resort, not the first step.

**CSP-safe by default.** The theme ships a Content Security Policy with no
`'unsafe-inline'` for scripts, and uses the CSP build of Alpine. That
constrains component design in ways worth knowing about — see
[Dark mode](#dark-mode) and [Form field](#form-field).

## Color

Four semantic roles. Each resolves through a CSS custom property, so a site can
repoint the palette without touching a class string.

{{< swatch name="brand" >}}
{{< swatch name="brand-alt" >}}
{{< swatch name="accent" >}}

The chips above are painted from the live custom properties. Override
`[params.colors]` and they move with the rest of the theme.

{{< token-table group="color" >}}

`chrome-from` and `chrome-to` are the exception worth stating plainly: they are
declared and usable in your own class strings, but **nothing in the theme reads
them.** The header and footer gradients arrive through
`twClasses.headerBackgroundFrameOuter`, which deliberately stays a literal
Tailwind string. Setting them will not retint your header.

### What is deliberately not tokenized

{{< token-table group="untokenized" >}}

The alert colours are the sharpest case. Yellow in an alert means *warning* —
that survives a rebrand, and routing it through a brand token would destroy it.

### Card category gradients

Cards colour their header band from `cardCategoryColorsDefault`, set per
category or per page rather than from a token, because the point is that
categories differ from one another:

```toml
# content/categories/recipes/_index.md
cardCategoryColorsDefault = "bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-900"
```

## Typography

Titillium Web 400/600/700, loaded by `head/fonts.html` and resolved through
`--ryder-font-family` so `[params.fonts] family` can repoint it without a fork.

{{< token-table group="type" >}}

Note there are three eyebrow treatments, not one — `0.18em` in aside headings,
`0.2em` on article meta and form labels, `0.22em` on the share and footer
rails. They are close enough to look like a mistake and far enough apart to be
deliberate; if you are adding a label, match the neighbourhood it sits in.

## Space, radius, shadow

{{< token-table group="radius" >}}

{{< token-table group="shadow" >}}

Elevation carries one interaction: a card lifts from `shadow-sm` to `shadow-md`
on hover over 200ms. Nothing else in the theme animates elevation.

{{< token-table group="container" >}}

## Icons

Font Awesome, **tree-shaken**. Only icons explicitly imported into
`assets/js/main.js` ship in the bundle — an icon class used in a template but
never imported renders Font Awesome's placeholder glyph instead.

Adding one is three steps:

```js
// 1. find the camelCase name:  fa-swatchbook → faSwatchbook
// 2. import it (keep the list alphabetical)
import { faSwatchbook } from '@fortawesome/free-solid-svg-icons'
// 3. add it to library.add(...)
```

`tests/unit/faIcons.test.js` enforces this in both directions: an icon used but
not imported fails, and an icon imported but never used fails too. The icon in
this page's title had to be added to `main.js` before this page would pass.

Your own icons go in `assets/js/extended.js` — the user hook — not in
`main.js`.

## Dark mode

Three modes, set with `params.darkMode`:

| Value | Behaviour |
|---|---|
| `system` | Follows the OS preference. The default. |
| `toggle` | Adds the footer control, and remembers the choice |
| `off` | No dark mode at all — every `dark:` class is omitted from `<body>` |

`off` is a real omission, not a CSS override, which is why `twClasses.body` and
`twClasses.bodyDark` are separate params: changing your body font cannot
silently re-enable or disable dark mode.

The toggle you see in the footer of this page is the live component. Try it —
the swatches, tables, and form below all follow.

### Pairing rules

Surfaces pair `neutral-100` with `neutral-900`, panels pair white with
`slate-900/70`, and borders pair `slate-200/80` with `slate-700/70`. Colour
tokens shift *step*, not hue: article meta icons are `brand-700` in light and
`brand-300` in dark.

## Tokens

The token layer is the preferred way to restyle Ryder's colour. Full reference
in [CSS Overrides](/docs/css-overrides/#color-tokens); the shape of it:

```toml
[params.colors]
  brand     = "12 74 110"    # channels, not hex
  accent    = "217 70 239"
  accent-600 = "192 38 211"  # set every step a component uses
```

Two things that catch people out, both worth stating twice:

1. **Channels, not hex.** `"244 63 94"`, never `"#f43f5e"`. A hex inside
   `var()` works for `text-`/`bg-`/`border-` and then silently produces nothing
   for every opacity modifier — with no build error. A malformed value here is
   ignored with a build warning naming the key.
2. **The bare token moves one ramp step**, and which step differs per family:
   `brand`→`brand-800`, `brand-alt`→`brand-alt-800`, `accent`→`accent-500`.
   Setting `accent` alone leaves the CTA's `accent-600` border and `accent-300`
   ring at their defaults.

---

# Components

## Header, logo, nav

**The header above this page is the component.** Its outer frame, inner frame,
background image, and nav skin are all config:

```toml
[params.twClasses]
  headerBackgroundFrameOuter = "bg-gradient-to-r from-slate-900 to-slate-700 border-b border-rose-500 text-neutral-100"
  headerBackgroundFrameInner = "h-[240px] sm:h-[400px] bg-cover bg-center sm:bg-[center_30%]"
  headerBackgroundImage = "images/hyder_theme_header.webp"
```

The logo splits `logo_firstWord` and `logo_lastWord` across `ryder-brand-800`
and `ryder-brand-alt-800` — the brand pair, and the reason sky and lime are
brand rather than incidental. The nav encodes the same pair: links are
`brand-800`, the active entry is `brand-alt-800`.

Classes: `max-w-screen-xl px-3 py-3 md:px-4` on the shell, `rounded-lg` on the
inner frame, `rounded-full` on the mobile hamburger.

## Cards

**The card grid on the [home page](/) and every list page is the component.**
Variants are selected by config rather than by forking a template:

```toml
[params]
  listCardType = "-category-color"   # layouts/partials/card-category-color.html
```

A card is `rounded-xl` with `shadow-sm`, lifting to `shadow-md` on hover over
200ms. The header band takes its gradient from the page's category. Grid gutter
is `gap-6`.

## Article header & aside

**This page is the component.** The header band above, with its icon, title,
and meta row, is `.article-header-*`; the aside to the side of this text holds
the tag chips and the table of contents.

Aside internals are the accent's home ground — `.aside-taxonomy-icon` and
`.aside-toc-icon` are `ryder-accent-500`, and the tag chips are the accent's
`50`/`300`/`400`/`100` steps in light and `950`/`900`/`700` in dark. That is
why rose won the accent slot: it was already structural here.

```go-html-template
{{ partial "terms.html" (dict "taxonomy" "tags" "page" .) }}
{{ partial "toc.html" . }}
```

## Breadcrumb, pagination, taxonomy

The breadcrumb above this article and the pager on any list page are live.
The tag cloud is embeddable, so here it is:

{{< taxonomy-cloud >}}

Chips are `rounded-full` with a lime gradient fill and an accent
border/hover/ring. The fill is brand; only the edge is accent. Through v0.3.x
that edge was yellow — a sixth accent family with no other use in the theme.

## Alerts

Four semantic types. These are live `alert-wrapper` calls:

{{< alert-wrapper alertType="info" alertTitle="Info" alertMessage="Blue. Neutral information the reader did not ask for." >}}

{{< alert-wrapper alertType="success" alertTitle="Success" alertMessage="Green. Something worked." >}}

{{< alert-wrapper alertType="warning" alertTitle="Warning" alertMessage="Yellow — and this yellow is semantic, which is why it is not routed through a colour token." >}}

{{< alert-wrapper alertType="danger" alertTitle="Danger" alertMessage="Red. Something is broken or about to be." dismissable=true >}}

```
{{</* alert-wrapper alertType="warning" alertTitle="Heads up"
     alertMessage="Body text." dismissable=true */>}}
```

Each type is a `50`/`300`/`800` triple of its hue. `dismissable=true` adds an
Alpine-backed close button. The same partial powers site-wide banners via
`[[params.alphaAlert]]`.

## Buttons & CTAs

Live `cta-button` shortcodes:

{{< cta-button button_label="Default CTA" button_href="#buttons--ctas" >}}

{{< cta-button button_label="Amazon variant" button_type="amazon" button_href="#buttons--ctas" >}}

{{< cta-button button_label="Spotify variant" button_type="spotify" button_href="#buttons--ctas" >}}

```
{{</* cta-button button_label="Read the docs" button_relref="/docs" */>}}
```

The default is `rounded-full` on `bg-slate-800` with an accent border, hover
border, and focus ring — `accent-600`/`500`/`300`. The Amazon and Spotify
variants use those platforms' own colours on purpose, and should never be
borrowed for a generic button.

`params.colors.legacyAccents = true` restores the pre-v0.4.0 fuchsia edge.

## Share buttons

Live at the foot of this article when `showShareButtons` is on. Each network
button is `rounded-lg` with the platform's brand colour at `88%` opacity,
deepening to `92%` on hover — one of the places the channel-based tokens earn
their keep, since a hex would break those modifiers.

```toml
[params.shareButtons]
  networks = ["x", "email", "reddit", "facebook"]
  size = "small"   # small | medium | large
```

## Footer

**The footer below is the component.** It carries the menu, social icons from
`data/social.json`, the dark-mode toggle, optional taxonomy clouds, and the
meta rail. Its background falls back to `headerBackgroundFrameOuter` unless
`twClasses.footerBackground` is set.

---

# Patterns

## Shortcodes

Content-level building blocks. Media: `picture`, `photo-gallery`,
`video-lightbox`. Embeds: `youtube-embed`, `spotify-embed`, `soundcloud` — each
registers its own CSP host. Maps: `leaflet`, `openstreetmap`, `lat-long-box`.
Structured content: `recipe-ingredients-list`, `recipe-howto-steps-list`,
`highlight-github`, `amazon-associate-link`.

Full list in the [README](https://github.com/arts-link/ryder#shortcodes).

## Form field

*New in v0.4.0.* The form **engine** — `ryderForm` — already existed: it
serializes fields to JSON, POSTs them, exposes request state, and swallows a
`_gotcha` honeypot. What was missing was the visual layer, so sites shipped
unstyled inputs next to styled buttons.

This form is live. Submitting it lands in the error state on purpose, because
the demo site has no backend:

{{< form-demo >}}

```go-html-template
{{ partial "utils/form-field.html" (dict
    "name" "email" "type" "email" "label" "Email"
    "placeholder" "you@example.com" "required" true) }}
```

Field: `border border-slate-200/80 rounded-lg px-3 py-2.5 text-base
bg-neutral-100 dark:bg-neutral-800`, focus ring `outline-2 outline-offset-2
outline-ryder-brand`. Label: the `0.2em` eyebrow. The submit button reuses the
default CTA class, so it follows `legacyAccents` with every other CTA.

The status bindings are plain property lookups (`isLoading`, `isSuccess`,
`isError`) rather than comparisons, because the CSP build of Alpine cannot
evaluate `status === 'success'`. Full engine docs in [Forms](/docs/forms/).

## Table wrapper

*New in v0.4.0.* `@tailwindcss/typography` owns table styling inside `prose`
and it cannot be overridden from within — so the wrapper opts out with
`not-prose` and re-states the cell styling. It also scrolls horizontally
instead of pushing the page sideways on a phone.

Every table on this page is one. Here is one being one:

{{< table-wrapper >}}
| Param | Default | Notes |
|---|---|---|
| `showDate` | `true` | Show post dates on cards and articles |
| `showAuthor` | `true` | Show the author on single pages |
| `showShareButtons` | `false` | Share row at the foot of an article |
{{< /table-wrapper >}}

```
{{</* table-wrapper */>}}
| Param | Default |
|---|---|
| `showDate` | `true` |
{{</* /table-wrapper */>}}
```

Shell: `border border-slate-200/80 rounded-xl overflow-hidden`, header cells
`bg-neutral-100 dark:bg-neutral-800 font-bold px-3.5 py-2.5`, rows separated by
`border-b border-slate-200/50`.

## Empty state

*New in v0.4.0.* A paginated list with nothing in it used to render a blank
grid followed by pagination controls for a single page of nothing.

**[See it live on the Empty Section page →](/docs/empty-section/)**

It is the third of three answers to "nothing here", and the only one needing no
configuration — the other two are `hideIfEmptyData` on a menu entry, and
`dataSource` + `emptyDataMessage` on a `list-plain` page. Wording comes from
`i18n/` (`emptyListTitle`, `emptyListBody`), so it translates rather than
configures.

Shell: `border border-dashed rounded-xl p-9 text-center`, `fa-signs-post` in
accent, `text-lg font-semibold` headline, muted body, and the default CTA home.
