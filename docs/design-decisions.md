# Design decisions

Durable record of *why* Ryder's visual system is the way it is. Component
documentation lives in the exampleSite (`/docs/design-system/`) and is generated
from the live theme; this file holds the reasoning that page can't carry.

Maintainer-facing. Not published by the exampleSite build.

---

## 1. The palette is stock Tailwind, and that was a problem

`tailwind.preset.js` adds no colors. Ryder's palette was therefore whatever
each partial reached for, and by v0.3.x that had grown to six accent families:
sky, lime, rose, fuchsia, yellow, and a green/amber pair in the CTA variants.

Only two of those were ever load-bearing. **Sky and lime are brand** — they come
from the logo, and the nav's default/active states encode them. Everything else
was incidental: fuchsia edged the header because it looked good against slate,
yellow bordered the tag cloud for no traceable reason.

Decision: name the roles, keep the values.

| Token | Value | Role |
|---|---|---|
| `--ryder-brand` | sky-800 `#075985` | logo word 1, nav link, meta icons, blockquote rule |
| `--ryder-brand-alt` | lime-800 `#3f6212` | logo word 2, active nav |
| `--ryder-accent` | rose-500 `#f43f5e` | aside icons, tag chips, tag cloud, CTA ring |
| `--ryder-chrome-from` / `-to` | slate-900 → slate-700 | *declared only* — the header/footer gradients come from `twClasses`, so nothing in the theme reads these |

Rose won the accent slot because it was already doing the job in the one place
accent colour is structural — the article aside, where `.aside-*-icon` and the
tag chips establish it. Fuchsia and yellow were the outliers, so they moved.

Deliberately **not** tokenized:

- **neutral-100/200/300/700/800/900** — surfaces, not brand. A site that
  repoints these is choosing a different theme, not configuring this one.
- **slate-500** meta labels, **slate-200/80** card borders — structural greys.
- **The alert 50/300/800 hue triples.** Yellow in `alert.html` is *semantic
  warning*, not decoration. Blue/green/yellow/red carry meaning that survives
  rebranding; routing them through brand tokens would destroy it.
- **Amazon yellow and Spotify green** in the CTA variants. These match the
  platforms they link to. They are not Ryder's colours to change, and they
  should never be borrowed for a generic button.

## 2. Tokens are RGB channels, not hex

```css
--ryder-accent: 244 63 94;   /* not #f43f5e */
```

```js
accent: 'rgb(var(--ryder-accent) / <alpha-value>)'
```

A hex value inside `var()` works for `text-`, `bg-`, and `border-`, then
silently fails on every opacity modifier — `border-ryder-accent/80` produces
nothing, with no build error. Ryder leans on those modifiers heavily: the card
borders are `/80`, the aside dark states `/40`, the share-button fills `/88`.
Channels plus `<alpha-value>` keep them working.

The cost is that config overrides must be supplied as channel triplets. That is
an unusual thing to ask of a config file, and it is documented in
`/docs/css-overrides/`. We accepted it rather than adding hex-to-channel
conversion in a Hugo template, which would have put string parsing on every
page render to save users one lookup.

Precedent: `--ryder-font-family` already worked exactly this way — a CSS custom
property the preset reads, so `params.fonts.family` can repoint it without a
fork. Colour follows the pattern rather than inventing a second one.

## 3. Tokens are for partial internals only

The default `twClasses` strings shipped in `hugo.toml` stay literal
(`border-b border-rose-500`, not `border-b border-ryder-accent-500`).

The header edge is the one accent role that is therefore **not** token-driven:
rose-500 is the accent's value, but repointing `--ryder-accent` does not move it.
That is deliberate, and it is why the §1 table above lists the edge under the
header rather than the accent.

Those strings are quoted in the docs and have been copied into users' own
configs. If a shipped default starts referencing `ryder-*` while a user's
override doesn't, they get half a palette — the worst kind of upgrade, because
it looks like a theme bug rather than a config mismatch.

So: `@apply` rules in `main.css` and hardcoded classes inside partials migrate.
Anything a user can override stays literal, and the token layer is the *better*
override path offered alongside, not a replacement.

Corollary: `bg-fuchsia-900/40` in the `navClass` docs and E2E test is a
user-supplied example demonstrating arbitrary classes. It is not theme styling
and was left alone.

## 4. `legacyAccents` exists, and should eventually go

Moving the tag cloud and header edge to accent is the only change in the token
work that alters pixels. `params.colors.legacyAccents = true` restores yellow
and fuchsia for sites that had built around them.

It is a migration aid with a shelf life. Remove it at the next major.

## 5. Components the theme was missing

Three gaps meant every consuming site invented its own:

- **Form fields.** `ryderForm` already handled submit, status booleans, and the
  `_gotcha` honeypot — only the visual layer was absent, so sites shipped
  unstyled inputs next to styled buttons.
- **Tables.** `@tailwindcss/typography` owns tables inside `prose` and they
  cannot be restyled from within. The wrapper needs `not-prose`; there was no
  way to get a themed table without one.
- **Empty states.** `menu.html` already knew how to hide a section with no
  content via `hideIfEmptyData`. The list page didn't, so an empty section
  rendered as a blank page with pagination.

All three were built only from values already in the theme — no new colours,
radii, or shadows entered the system to add them.

## 6. Documentation is generated, not written

`/docs/design-system/` renders the real partials. Previews *are* the live
components, so the page cannot drift when a partial changes, and it inherits
dark mode, the TOC, and the aside for free.

The alternative — a hand-maintained page of static markup — is wrong the first
time someone touches a partial, and wrong invisibly. Token values on that page
come from `data/design-system.json`, so a value exists in exactly one place.

What generation can't capture is this file: the reasoning. Keep them separate.
