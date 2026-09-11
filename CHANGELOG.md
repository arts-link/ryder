# Changelog

All notable changes to the Ryder Hugo theme are documented in this file.

## v0.5.0

An SEO and heading-semantics pass. The findings come from building
benstrawbridge.com — a 1000+ page production site — against v0.4.3 and reading
the output rather than the templates, so every number below is measured.

**This is a minor release because the breadcrumb default changes for every
consuming site.** Nothing needs configuring to pick the change up, and nothing
needs configuring to keep the old look — the old look is gone. Read the first
entry before upgrading.

- **Breadcrumbs no longer end in the current page, and top-level pages render no
  trail at all.** *(behaviour change)* The trail was `Home » … » This Page`, with
  that last crumb a self-link sitting directly above the `<h1>` saying the same
  words — a duplicated heading and a link to nowhere. On a top-level page the
  whole thing collapsed to `Home »` plus that self-link. The rule is now Home
  plus ancestors, rendered only when the page has a parent that is not Home, so
  `/posts/` renders nothing and `/posts/towers/` renders `Home » Posts`.
  - The wrapper `<ul>` is an `<ol>`, matching the `BreadcrumbList` semantics.
  - The `»` separator moved outside the `<a>` and gained `aria-hidden="true"`.
    It used to sit inside the link text, so it was part of every crumb's
    accessible name — screen readers read "Home angles right".
  - The final `<li class="active">` and its `aria-current="page"` are gone.
    **If your site has CSS or tests keyed to either, update them.**
  - The depth rule lives in three files that must stay in step:
    `partials/breadcrumb.html` (which self-guards, so it is safe called
    directly), the wrapper `<div>` in `_default/baseof.html`, and the JSON-LD in
    `head/schema.html`. Without the second, an empty wrapper div shipped on
    every top-level page.
- **One `BreadcrumbList` per page, not two.** A page with categories used to
  emit a second, category-derived trail alongside the section one — two
  competing answers for a single URL. On a site cascading
  `categories = ["posts"]` over a `/posts/` section, the second trail read
  `Home » posts » …`, a near-duplicate of the first. The category-derived list
  is removed.
- **The breadcrumb JSON-LD now respects `showBreadCrumbs`.** It was gated only
  on `not .IsHome`, so a site with the visible trail switched off still claimed
  a breadcrumb in its markup, and top-level pages emitted one for a trail they
  never rendered. The visible trail and the structured data are now gated
  identically. The structured data still carries the current page as a final
  `ListItem` — with a `name` and no `item`, the standard pattern for the page
  you are on, which keeps Google's SERP breadcrumb rendering. Ancestor items
  switched from `.Title` to `.LinkTitle` so they match the visible crumbs; the
  leaf keeps `.Title`, matching the `<h1>`.
- **The wordmark is no longer an `<h1>`.** `partials/logo.html` wrapped it in
  one and `header.html` renders it on every page, so every page with its own
  title shipped **two** `<h1>`s and the home page's only `<h1>` was the site
  name. It is now a `<span>`.
  - **The replacement carries `block text-4xl font-bold tracking-tight`, and
    those classes are load-bearing.** `assets/css/main.css` has
    `@layer base { h1 { @apply text-2xl font-bold tracking-tight } }`. The
    `text-4xl` utility already beat `text-2xl`, but `font-bold`,
    `tracking-tight` and block display came from that base rule and are lost the
    moment the tag changes. A bare tag swap silently re-renders the wordmark
    lighter and looser. If you have forked `logo.html`, apply the classes as
    well as the tag.
  - `nowrap` is carried across unchanged. It is not a Tailwind class
    (`whitespace-nowrap` is) and has always been inert; "fixing" it would newly
    force nowrap and could change the header layout.
  - `hidden-home/baseof.html` calls `logo.html` directly rather than through
    `header.html` and has no other heading, so the wordmark's `<h1>` was that
    layout's only one. It now renders `<h1 class="sr-only">{{ .Title }}</h1>` —
    the cover page looks identical and its outline names the page.
- **The home page title is an `<h1>`.** `_default/home.html` rendered it as an
  `<h2>` — sensible when the wordmark above it was the `<h1>`, wrong now. Tag
  only; the element already carried explicit `text-2xl font-bold`, so nothing
  changes visually. It is still gated behind `showHomeTitle`, which is now
  documented.
- **The empty bordered card on the home page is fixed.** The card wrapper was
  gated on `or .Title .Content` while the title inside it additionally required
  `showHomeTitle`, so a home page with a title, no body and `showHomeTitle`
  unset rendered an empty bordered box. Both are now gated on what actually
  renders.
- **New: `params.taxonomyDescription`.** Taxonomy term pages have neither a
  `description` nor a summary, so every one of them fell through to the single
  site-wide description — 1,004 pages sharing one sentence on the site this was
  measured against. Supply a `printf` template per taxonomy, keyed by its
  singular name and rendered with the term title:

  ```toml
  [params.taxonomyDescription]
    tag      = "Everything tagged “%s” on Example."
    category = "Articles filed under “%s” on Example."
  ```

  Each entry needs exactly one `%s`. Term pages only — on `/tags/` the singular
  key is also `tag` while the title is "Tags", so one shared template would read
  "Everything tagged Tags". A term's own `description` still wins, and a
  taxonomy with no entry falls through to the site description, so adding
  nothing changes nothing.
- **New: `params.titleShort`.** The `<title>` suffix was `site.Title`, which is
  often the long legal or marketing name; a 34-character one truncated nearly
  every SERP title. Precedence is now per-page `sectionTitle`, then
  `params.titleShort`, then `site.Title` — so existing sites are unaffected, and
  `sectionTitle` keeps working for the sections that have a cascade.
- **The site-wide JSON-LD entity is named from `params.author.name`.** It took
  `site.Title`, so a `Person` entity ended up named after the whole site
  ("Ben Strawbridge Dot Com Consulting"). Falls back to `site.Title` when
  `params.author.name` is unset.
- **Tests** — `tests/e2e/schema.spec.js` asserted a categorised post carries
  exactly **2** `BreadcrumbList` blocks; that assertion is now 1, plus new cases
  for a top-level page emitting none and for the unlinked leaf item. Three new
  suites: `breadcrumb.spec.js` (depth rule, ordered list, separator placement,
  and `showBreadCrumbs = false` proven against a same-depth sibling),
  `headings.spec.js` (exactly one `<h1>` per page, and the wordmark's *computed*
  font size, weight and display — the regression a class-list assertion would
  miss), and `headSeo.spec.js` (term descriptions, precedence, `titleShort`,
  entity name).
- **exampleSite** — sets `showHomeTitle`, `titleShort` and a
  `[params.taxonomyDescription]` table so the reference implementation exercises
  them. New `docs/breadcrumbs/` section with a three-levels-deep child and a
  `showBreadCrumbs = false` sibling: it documents the depth rule and is the
  fixture the new suites read.
- **Verification** — 14 unit tests and 108 e2e specs on Hugo 0.146.0, the
  version both workflows pin and the theme's stated floor, plus a full
  exampleSite build inspected as HTML rather than as templates.

## v0.4.3

A dependency-maintenance release: the five open Dependabot updates, merged
together and verified as one tree. No theme code, template, or configuration
changed, so there is nothing to migrate — the version bump exists to publish
the refreshed dependency floor to consuming sites.

- **Dependencies** — `@alpinejs/csp` and `@alpinejs/focus` move from `^3.15.12`
  to `^3.16.2` in the theme's own manifest (#93, #95), and the exampleSite's
  copies to `^3.16.1` (#92). These are the only two runtime dependencies in the
  set; everything else below is dev- or CI-scope. The root lockfile resolves
  `focus` to 3.16.3, the newest patch the caret admits at merge time, rather
  than the 3.16.2 Dependabot pinned on its own branch — a consequence of
  regenerating the lockfile to combine the two Alpine bumps, which land on the
  same lines of `package.json`.
- **Dependencies** — `@playwright/test` `^1.62.0` → `^1.62.1` and `vitest`
  `^4.1.10` → `^4.1.11` in the root dev dependencies (#94). Test tooling only;
  neither ships to a site.
- **Dependencies** — the exampleSite's build chain takes `postcss` 8.5.25 →
  8.5.26 and `postcss-import` `^16.1.1` → `^17.0.0` (#92). The `postcss-import`
  major raises its floor to Node 22, which the theme already requires through
  `engines` and CI already runs (Node 24), so the bump costs nothing here. It is
  dev-scope in the exampleSite's own PostCSS config; the theme's Tailwind
  compile runs through `css.PostCSS` inside the Hugo build and does not read it.
- **CI** — `actions/checkout` v6 → v7 across all four workflows: `claude.yml`,
  `hugo.yml`, `release.yml`, and `test.yml` (#84).
- **Verification** — the combined tree, not the five branches separately: 14
  unit tests, all 84 e2e specs, and a clean `hugo --source exampleSite` build on
  Hugo 0.146.0, the version both workflows pin and the theme's stated floor.
  Each Dependabot branch was green on its own before the merge; the lockfile
  conflicts between the two Alpine bumps and the dev-dependency group were
  resolved by regenerating from the merged manifest, so the checked-in tree is
  what a fresh install produces rather than a hand-stitched merge.
- **No screenshot refresh** — `AGENTS.md` ties the Hugo themes submission
  screenshots to a minor bump or greater. This is a patch, and nothing about it
  is visible on a rendered page.

## v0.4.2

A single-bug patch on top of v0.4.1. No configuration changes, no migration:
cards that relied on Hugo's auto-truncated summary now render it as text.

- **Fix** — `card-category-color.html` rendered `.Summary` as raw HTML. A page
  with no `<!--more-->` marker and no `summary` front-matter key gets a
  `.Summary` that Hugo builds by truncating the *rendered* HTML at
  `summaryLength` words, and that cut is not guaranteed to land on an element
  boundary. The browser re-parents everything after an unclosed element, so a
  single content page could swallow every card that followed it on a feed page —
  the blast radius was the whole page, not the offending card. The fallback
  branch now runs through `plainify | htmlUnescape | chomp`, in line with the
  theme's seven other `.Summary` consumers, which makes the failure impossible
  to express rather than fixing the one page that happened to trigger it.
  `homeFeatureSummary` is unchanged and remains the way to write a card blurb
  yourself. Reproduced on Hugo 0.146.0 and 0.164.0 (issue #86).
- **Tests** — `tests/e2e/cardSummary.spec.js` pins the invariant on three feed
  pages: card summaries contain no element markup, and cards stay siblings of
  one another. The markup assertions fail against the pre-fix partial.

## v0.4.1

- **Dependencies** — Clear six advisories in the exampleSite's dependency tree:
  `brace-expansion`, `cross-spawn`, `glob`, `minimatch` and `picomatch` (high),
  and `yaml` (moderate). All were transitive dev-scope packages under the
  Tailwind/PostCSS build, so nothing shipped to a site visitor or a consuming
  site, and none was reachable as described — the `glob` advisory needs its CLI's
  `-c/--cmd` flag, and the rest need attacker-controlled glob patterns where the
  only patterns are the `content` globs in `tailwind.config.js`. Resolved by
  `npm audit fix`, which touched the lockfile only: no direct dependency changed
  version, so this is a transitive dedup rather than an upgrade.
- **Documentation** — `CLAUDE.md`'s CI section claimed the workflows pin Hugo
  0.138.0 and warned it was below the theme's 0.146+ floor. Both workflows
  actually pin 0.146.0, and have for some time. The stale warning mattered more
  than a normal doc drift: v0.3.2's `picture.html` and `highlight-github.html`
  use the `try` keyword, which requires Hugo 0.141+, so a runner on 0.138.0
  would fail on templates the theme itself ships. The section now names both
  workflows and states the constraint.

## v0.4.0

A semantic colour layer, one accent instead of six, three components the theme
was missing, and a design-system page that documents all of it by rendering the
live theme. One visual change for existing sites, behind a flag — see
`docs/migration/v0.4.0.md`. The reasoning is recorded in
`docs/design-decisions.md`.

- **Colour tokens** — `tailwind.preset.js` gains a `ryder` colour namespace
  resolving through `--ryder-*` custom properties, defaulted in
  `assets/css/main.css`. Sites override them from `[params.colors]`, read by
  the new `head/colors.html`. Values are space-separated RGB channels rather
  than hex so Tailwind's `<alpha-value>` can interpolate: a hex inside `var()`
  works for `text-`/`bg-`/`border-` and then silently breaks every opacity
  modifier, which the theme uses throughout.
- **Colour tokens** — `brand`, `brand-alt`, and `accent` each carry a full
  50–950 ramp, because the theme's own classes span most of it. The step
  matching a family's canonical shade aliases the headline token
  (`--ryder-brand-800: var(--ryder-brand)`), so setting one token retints both.
  `chrome-from`/`chrome-to` are declared for use in your own class strings;
  nothing in the theme reads them.
- **Colour tokens** — migrating the theme's internals onto the tokens is a pure
  rename. Verified by diffing the compiled stylesheets of `a124253` and the
  release with the token indirection resolved: no selector lost, one
  declaration changed in notation only.
- **Breaking-ish** — the tag cloud's yellow border/hover/ring and the default
  CTA's fuchsia border/hover/ring move to the accent. This is the only change
  that alters an existing site. `params.colors.legacyAccents = true` restores
  both. It cannot reach the header's bottom edge, which comes from a site's own
  `twClasses`.
- **New** — `layouts/partials/utils/form-field.html`, the visual layer for the
  existing `ryderForm` engine: text-like inputs, `textarea`, and a `submit`
  variant bound to the engine's status booleans.
- **New** — a `table-wrapper` shortcode. `@tailwindcss/typography` owns table
  styling inside `prose` and cannot be overridden from within, so the wrapper
  opts out with `not-prose` and scrolls horizontally rather than widening the
  page.
- **New** — an empty state on `layouts/_default/list.html`, which previously
  rendered a blank grid and a pager for a single page of nothing. Wording comes
  from `i18n/` (`emptyListTitle`, `emptyListBody`).
- **New** — `/docs/design-system/` on the exampleSite, documenting tokens, type
  scale, spacing, and every component. Every preview is a live partial or
  shortcode call, so the page cannot drift when a partial changes; values come
  from `exampleSite/data/design-system.json` via new `swatch` and `token-table`
  shortcodes.
- **Footer** — taxonomy group headings now link to their taxonomy root page,
  with a dotted underline at rest so they read as links. The href resolves
  through `site.GetPage`, so a site that disables the taxonomy kind or renames
  its path gets a plain heading rather than a link to a 404.
- **Docs** — `docs/design-decisions.md` records why rose is the accent, why
  tokens are channels, and why shipped `twClasses` defaults stay literal.
  `docs/migration/v0.4.0.md` covers the accent change and `legacyAccents`.
- **Tests** — new `designSystem` and `footerTaxonomyLinks` e2e specs, plus
  coverage for the aside's dark-mode styles. 79 e2e, 14 unit.
## v0.3.2

- **Fix** — `picture.html` no longer aborts the build on remote images.
  It read `.Err` on the result of `resources.GetRemote`, a field removed in
  Hugo v0.141.0 — below the theme's own v0.146.0 floor, so the failure applied
  to every supported Hugo version. The call now goes through `try`. Only
  absolute-URL sources were affected, so bundle-resource-only sites never saw
  it.
- **Fix** — `highlight-github` degrades to a link instead of killing the
  build when `api.github.com` is unreachable. Both fetch sites used
  `with`/`else` around `resources.GetRemote`, which raises a hard template
  error on a blocked host — so the `else` branch never ran and the build died
  with a raw internal error. Both now use `try`, warn, and fall back to a link
  to the file on GitHub. Set `params.highlightGithubStrict = true` to keep the
  hard failure.
- **Development** — Both templates raise their in-file minimum Hugo version
  from 0.125.6 to 0.141.0, the floor for the `try` keyword. The theme already
  required 0.146.0 in `hugo.toml`.

## v0.3.1

- **Dependencies** — Update `jsdom` from 29.1.1 to 30.0.1 and the example
  site's `postcss` from 8.5.23 to 8.5.25.
- **CI** — Update `actions/deploy-pages` from v4 to v5,
  `actions/setup-node` from v6 to v7, and `actions/configure-pages` from v4 to
  v6.
- **Development** — Move the test workflow to Node.js 24 and declare the
  supported Node.js range required by `jsdom` 30.

## v0.3.0

The breaking release. Four breaking changes, listed under **Breaking** below
with what each one asks of you. Upgrade from v0.2.5, not from further back —
see `docs/specs/v0.3.md` for the staged path.

- **2.2** — `head/schema.html` is rebuilt to construct Hugo `dict`s and
  `jsonify` them instead of hand-writing JSON as template text. v0.2.4's item
  1.2 fixed that bug class by deleting three stray `//` comments; this removes
  the technique that made them possible. Along the way: the file's three
  different homepage tests (`eq .Title .Site.Title`, `.IsHome`,
  `ne .Title .Site.Title`) collapse to `.IsHome`; `articleBody`, which inlined
  the entire rendered page body into every `BlogPosting`, is gone; dates are
  emitted as RFC 3339 rather than Go's default time format; and breadcrumbs are
  separate script blocks instead of one conditionally-nested array.
- **2.2** — New `layouts/partials/head/schema-extra.html`, a no-op hook called
  from `head-seo.html` and shadowed from your own `layouts/`, mirroring
  `extend_head.html`. Add JSON-LD types without overriding `head/schema.html`,
  which silently drops every block the theme emits.
- **2.2** — New `params.schema.type` (default `"Organization"`) sets the
  site-wide entity on the home page, so `MusicGroup`, `Person`,
  `LocalBusiness`, etc. need no template override at all. `Person` receives an
  `image` rather than a `logo`, per schema.org.
- **2.2** — `head/schema-recipe.html` gets the same dict-based rewrite. It
  carried its own `// schema for recipes` comment inside the script tag, so
  the `Recipe` block never parsed either, and several comma-dependent
  emissions produced trailing commas when an optional field was unset or the
  last list entry was a `**` section header.
- **3.1** — New `tailwind.preset.js` carrying `theme`, `darkMode`, and
  `plugins`, and deliberately no `content`. `tailwind.config.js` becomes a thin
  wrapper holding only this repo's own dev globs. See **Breaking**.
- **3.1** — `fontFamily.titillium` now resolves through
  `var(--ryder-font-family, "Titillium Web")`, so the `font-titillium` class on
  `<body>` follows `[params.fonts]` instead of contradicting it. Third of the
  four hardcoded Titillium sites named in issue #3.
- **3.2** — `assets/css/style.css` is deleted. See **Breaking**.
- **3.3** — The `build-tw`, `watch-tw`, and `deploy-tw` npm scripts are
  deleted, and the README section that presented them as the build workflow is
  rewritten. See **Breaking**.
- **3.4** — Documented that a consuming site **must** declare `[outputs]`
  itself to get `llms.txt`. The v0.3 spec called the site's block a redundant
  duplicate on the grounds that theme config merges into the site's; that was
  tested against a scratch consumer and is false. `outputFormats` **is**
  inherited (so you need not redefine the `LLMSTxt` format), `outputs` is not.
  Deleting the block, as the spec advised, would have silently removed
  `llms.txt` from every Ryder site.
- **4.3** — PostHog's bootstrap is compiled with `resources.FromString |
  js.Build | fingerprint` and loaded via `src` + `integrity` instead of being
  inlined. See **Breaking**.
- **4.3** — New `params.csp.scriptSrcHashes`, a list of SHA-256 hashes for a
  site's own inline scripts. The policy ships as a `<meta http-equiv>` tag and
  a meta-delivered CSP cannot carry a nonce, so hashes are the only way to
  permit one inline script without permitting all of them.
- **Repo hygiene** — `hugo_stats.json` (root and `exampleSite/`) is now
  gitignored. It was tracked so that a clean build had a stats file to glob,
  but Hugo rewrites it on every build, so running `hugo server` dirtied the
  tree and aborted the next `git pull`. Measured cost of untracking it: on a
  cold clone the first CSS compile is missing 3 dynamically-assembled classes
  out of 726, all `resp-sharing-button` modifiers; every later build has them.
  Build twice if you produce release artifacts from a fresh clone.
- **exampleSite** — The recipe demo page declared `recipe = true` and every
  other recipe key *after* its `[menu]` table, so TOML absorbed them all into
  `menu.main`. `.Params.recipe` was nil: the page rendered "No ingredients
  listed." and emitted no `Recipe` JSON-LD at all. The theme's own reference
  implementation of the recipe feature had been dead. Fixed by moving `[menu]`
  last.
- **exampleSite** — `tailwind.config.js` converted to the consumer preset
  pattern it is meant to demonstrate; it had drifted a duplicate copy of the
  theme's tokens, missing the `xs` and `3xl` screens and with `'2xl': '1280'`
  missing its unit.
- **Tests** — New `tests/e2e/schema.spec.js` (8 cases) and
  `tests/e2e/csp.spec.js` (10 cases, including a production fixture build for
  the PostHog assertions the dev server cannot make).

### Breaking

**1. The `*-tw` npm scripts are deleted (3.3). This breaks build commands, not
rendering.** Any CI, Vercel, or Netlify command running
`npm run build-tw && hugo --minify` will now fail on a missing script.

*What to do:* drop the `npm run build-tw &&` half. Tailwind already compiles
inside the Hugo build via `head/css.html`'s `css.PostCSS`, so `hugo --minify`
alone is sufficient — and always was. Confirm `tailwindcss`, `postcss`,
`postcss-cli`, and `autoprefixer` are installed at your **project root** (not
in `themes/ryder/` — Hugo invokes PostCSS from your project root and consults
only that `node_modules`) alongside a `postcss.config.js`. If your docs
prescribe a two-terminal watch loop, delete that too; it was never required.

**2. `script-src` no longer carries `'unsafe-inline'` (4.3). This fails in the
visitor's browser, not in your build.** Before v0.3.0, enabling PostHog
appended `'unsafe-inline'` to `script-src` for the whole site, because the
bootstrap snippet was inline. Any inline `<script>` of your own was being
permitted by that side effect and will now be blocked. CSP violations do not
fail the build.

*What to do:* grep your templates for `<script>` without a `src`. For each,
either add its SHA-256 to the new `params.csp.scriptSrcHashes`, move the code
into `assets/js/extended.js` (bundled into `main.js`, needs no allowance), or
set `params.csp.scriptSrc = "'unsafe-inline'"` explicitly — the point of the
change is that widening becomes a decision rather than a default. Verify with
a production build and a browser console showing zero violations, not by
reading the config. `style-src` keeps its `'unsafe-inline'` deliberately;
Alpine's `x-show` writes inline styles.

**3. JSON-LD output changes shape (2.2).**

*What to do:* if you override `head/schema.html`, delete the override and move
your additions into `head/schema-extra.html`, setting `params.schema.type` for
the site-wide entity — an override silently costs you `WebPage`,
`BlogPosting`, the site entity, and both `BreadcrumbList` blocks. If you do
not override it, revalidate at Google's Rich Results Test. Practical risk is
low, since per v0.2.4's item 1.2 the old output never parsed at all, but
verify rather than assume.

**4. The Tailwind config becomes a preset (3.1).** Any site whose
`tailwind.config.js` does `require('./themes/ryder/tailwind.config.js')` gets
that file's dev globs, which match nothing from your project root.

*What to do:* switch to the preset form. This one fails loudly and immediately
at build time, so it is the least dangerous of the four.

```js
module.exports = {
  presets: [require('./themes/ryder/tailwind.preset.js')],
  content: [
    './themes/ryder/layouts/**/*.html',
    './layouts/**/*.html',
    './content/**/*.md',
    './hugo_stats.json',
  ],
};
```

Sites also inherit **3.2**: `themes/ryder/assets/css/style.css` no longer
exists. It was a committed 125 KB build artifact that no template read. If
anything in your site resolves it by hand, remove that.

### Not a change, but worth knowing

`[outputs]` is **not** inherited from a theme (3.4). If you have been carrying
`home = ["HTML", "RSS", "LLMSTxt"]` in your own config and were told it was a
redundant duplicate of the theme's, keep it — it is what produces `llms.txt`.
The `LLMSTxt` *output format* definition does come from the theme, which is why
that one line is all you need.

## v0.2.5

- **2.7** — Make the page shell configurable and hookable. `<body>`'s classes
  now come from `[params.twClasses] body` and `bodyDark` instead of being
  hardcoded in `baseof.html`; the wrapper `<div>` gains a stable `site-shell`
  class with `position: relative`; and the dev-only `tw-size-indicator` partial
  moves inside that wrapper, so `<body>` has exactly one element child in every
  environment. `bodyDark` is separate from `body` so that customizing the body
  font cannot silently disable dark mode, and so `darkMode = "off"` still emits
  no `dark:` variants (unchanged from v0.2.4).
- **4.1** — Ship `ryderTrack`, an `Alpine.data()` component that reads
  `data-track-event` / `data-track-props` off the clicked element and forwards
  them to the configured analytics provider (PostHog or Plausible). Missing
  providers no-op and malformed props warn and degrade to `{}` — neither breaks
  the handler.
- **4.2** — Ship `ryderForm`, an `Alpine.data()` component that POSTs a form as
  JSON to `data-form-action`, exposes `status` plus `isIdle`/`isLoading`/
  `isSuccess`/`isError`, honors a `_gotcha` honeypot, and fires an optional
  `data-track-event` on success.
- **4.4** — Add `assets/js/cspLint.js`, a development-only linter that warns in
  the console about Alpine directives the CSP evaluator cannot run — references
  to browser globals, and arrow functions — naming the offending element. It is
  never loaded outside `hugo.Environment == "development"`.
- **4.5** — Document the CSP-Alpine restriction in `README.md`, along with both
  new components and `assets/js/extended.js`, the theme's sanctioned custom-JS
  hook, which was previously undocumented.
- **2.1** — Ship `_default/list-plain.html` (title + `.Content`, no
  pagination/card grid) for data-driven singleton sections, selected via
  Hugo's own `layout` front-matter field; ship `partials/utils/data-items.html`,
  a returning partial for the `.Site.Data.<name>.items | default slice` idiom.
- **2.3** — Widen the OG image resolver with a front-matter `og_image` escape
  hatch, checked before the existing bundle-resource / `og_image_default`
  chain (which is otherwise unchanged).
- **2.4** — Support `hideIfEmptyData` under `[menus.<id>.params]`, naming a
  `data/*.json` file whose `items` array must be non-empty for that menu
  entry to render.
- **2.5** — Resolve a page-overridable `navClass` (or `twClasses.nav`) in
  `header.html` and pass it into the menu partial, so a single page can
  restyle just the nav without forking `header.html` into a new `headerType`
  variant. Documented as the "one variant plus `.Param` for the skin"
  pattern.
- **5.1** — Ship `youtube-embed` and `spotify-embed` shortcodes, following
  the `soundcloud`/`openstreetmap` pattern of auto-registering their iframe
  host in CSP `frame-src`. Named distinctly from Hugo's built-in `youtube`
  shortcode rather than overriding it.
- **5.2** — Add a `video-lightbox` shortcode and a `videoLightbox`
  `Alpine.data()` component beside the existing `imageGallery` (images
  only); the iframe's `src` is only set once the modal opens.
- **5.3** — `utils/socialslist.html` now accepts a flat name → URL map (what
  Decap CMS emits) in addition to the original `{main:[...]}` shape, and
  ships inline SVGs for Instagram, TikTok, Apple Music, Tidal, and Spotify
  for entries with no `icon` field, rather than widening the tree-shaken
  Font Awesome brand set.
- **5.4** — Add `logo_wrapperClass`; the wrapper chrome (background, hover
  state, padding) around the logo is now dropped automatically once
  `logo_png` is set. `logo_png`'s `.Param` (page-overridable) contract is
  documented as authoritative.
- **5.5** — Parameterize `head/favicon.html` via `[params.favicon]` (`ico`,
  `version`, `svg`, `appleTouchIcon`, `webmanifest`), each defaulting to a
  file the theme already ships.
- **5.6** — `_default/home.html` now reads `showHomeFeed` via `.Param`
  instead of `site.Params`, so a page-level override (e.g. a cascade) is
  honored instead of being a silent no-op.
- **Issue #3 (partial)** — Add `[params.fonts]` (`family`,
  `googleFontsFamily`, `disableGoogleFonts`), covering `head/fonts.html`'s
  Google Fonts URL and a new `--ryder-font-family` CSS custom property that
  `assets/css/main.css`'s `.resp-sharing-button` rule now reads. Does not
  close issue #3 — see `docs/specs/v0.3.md`'s cross-check for what remains.

### Breaking

None. Everything above is additive or opt-in.

### Migration note — 2.7 changes the DOM around `<body>`

Two structural changes ship in 2.7. Neither changes rendered output on a stock
site, but both can affect a site with its own CSS. **Grep your CSS for `body >`
before upgrading.**

1. **The wrapper `<div>` is now `position: relative`.** It was unpositioned, so
   it did not establish a containing block. Any `position: absolute` descendant
   that was previously resolving against the viewport (or against some further
   ancestor) now resolves against the shell instead, and may move. Audit
   absolutely-positioned elements, particularly full-bleed and off-canvas
   elements that relied on `inset-0` reaching the viewport.

2. **`tw-size-indicator` moved inside the wrapper.** In non-production builds it
   used to render as a sibling of the wrapper, so `<body>` had two element
   children in development and one in production. Any selector written against
   `<body>`'s direct children — `body > div`, `body > *:first-child`,
   `:nth-child()` on that level, or a `:not()` hack written to skip the
   indicator — was already environment-dependent and will now behave
   differently.

   The known real-world case is a rule of the shape:

   ```css
   body:has(.some-nav) > div:not(.fixed) { position: relative; }
   ```

   That rule exists only to select the wrapper while skipping the dev-only
   indicator. It can now be deleted outright: the theme provides both the hook
   and the positioning.

   ```css
   /* replace the above with nothing, or target the hook directly */
   .site-shell { … }
   ```

If you override `layouts/_default/baseof.html` in your own site, your copy
shadows the theme's and none of this applies until you re-sync it — which also
means you will not get `twClasses.body` or `site-shell` until you do.

## v0.2.4

Tier 1 fixes from the v0.3 upstream change spec — silent failures and defects,
none of them breaking. See each item's number in the spec for full detail and
evidence.

- **1.1** — Document the `[security.funcs] getenv` requirement for
  `PUBLIC_POSTHOG_*` env vars, add the (commented) block to `exampleSite`, and
  warn at build time when PostHog is selected but no key can be found from
  either params or a blocked/unset environment variable.
- **1.2** — Remove the JavaScript comments emitted inside
  `<script type="application/ld+json">` blocks in `head/schema.html`, which
  made every affected block fail to parse as JSON.
- **1.3** — Normalize a leading slash off `og_image_default`, wrap the
  `resources.Get` lookup in `with`, and `errorf` naming the offending param
  and value on a miss, instead of a nil-pointer panic. Document
  `og_image_default` as `assets/`-relative only, and note that extended Hugo
  is required whenever any OG/processed image is WebP.
- **1.4** — Guard `footer.html`'s unguarded `.Site.Params.footer.tagCloud`
  reads with `.Param "footer.tagCloud"`, so a site with no `[params.footer]`
  block builds.
- **1.5** — Add `params.darkMode` (`"toggle"` / `"system"` / `"off"`) with a
  non-regressing default mapping from the legacy `showDarkToggle` param, so
  `"off"` skips `themeBoot.js`, the theme switcher, and the `dark:` Tailwind
  variants on `<body>` — while every existing site renders identically until
  it opts in.
- **1.6** — Auto-register embed iframe hosts (`soundcloud`, `openstreetmap`)
  on the page store and fold them into CSP `frame-src`; add a
  `params.csp.embeds` preset for hosts the theme can't auto-detect (Hugo's
  built-in `youtube`/`vimeo` shortcodes); fix `exampleSite`'s CSP config,
  which was missing the uMap host for its own `openstreetmap` demo.
- **1.7** — Declare the theme's runtime JS dependencies
  (`@alpinejs/csp`, `@alpinejs/focus`, `leaflet`, the Font Awesome packages)
  in the theme's own `package.json`, and warn (not error) in `head/js.html`
  when a consuming site hasn't installed them at its project root — which is
  where `js.Build` actually resolves them from.
- **1.8** — Move `[build] writeStats` and the three `[[build.cachebusters]]`
  rules from `exampleSite` into the theme's own `hugo.toml`, so every
  consumer inherits `hugo_stats.json` generation and dev-server cachebusting
  (a site's own `[build]` block still wins).
- **1.9** — Correct `REWRITE.md`'s stale claims that `header-fun.html` and
  `footer-fun.html` exist: they were created, then removed nine days later as
  collateral in an unrelated refactor, and the log was never updated. Reword
  the Phase 5 deferral and note the removal instead of silently rewriting
  history.
- **2.6** — Guard `baseof.html`'s `headerType`/`footerType` variant dispatch
  (and `header.html`'s `menuType` dispatch) with `templates.Exists`, `warnf`
  the param name and resolved partial on a miss, and fall back to the base
  variant instead of failing the build with a cryptic error. This is also
  what makes 1.9's class of bug self-reporting going forward.

### Breaking

None.
