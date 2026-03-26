# Ryder Theme — Rewrite Log

This document tracks the modernization rewrite of the Ryder Hugo theme (v0.1 → v0.2).
Started: 2026-03-17. Branch: `rewrite`.

The goal is a tighter, more composable, more elegant theme — fewer files, consistent conventions,
no dead code, and a cleaner experience for the person setting up a new site with Ryder.

---

## Audit Findings (Pre-Rewrite)

Full code review conducted before any changes. Key findings:

### Dead Code — Files With No Purpose
- `layouts/partials/old-page_gallery.html` — prefixed `old-`, uses dead JS library (FreeJairyGallery)
- `layouts/partials/taxonomy_list.html` — contains only a comment saying "TODO refactor/delete"
- `layouts/partials/footer-tag-cloud.html` — superseded by `footer.html`, unreferenced
- `layouts/shortcodes/alltrails-referral-link.html` — single-service affiliate link, hardcoded SVG, not a theme feature
- `layouts/shortcodes/webamp.html` — Winamp embed, external CDN dependency, never used in exampleSite
- `i18n/` keys `albums`, `photoCount`, `albumCount`, `in` — defined in all 3 language files, not used in any template

### Production Site Code That Leaked Into the Theme
- `layouts/shortcodes/affiliate-link-builder-form.html` — contains hardcoded affiliate IDs for specific sites (`artslink-20`, `benstrawbridge-20`, `grrquarterly-20`)
- `layouts/shortcodes/amazon-associate-link.html` — same concern, simpler version

### Duplicate Code
- `menu.html` / `menu-fun.html` — 100% identical except one CSS class name on line 11
- `card-category-color.html` / `card-super-simple.html` — duplicate metadata extraction logic at top of both
- `share-buttons.html` — ~230 lines of CSS duplicated inside the same file, should live in `assets/css/`

### Naming Inconsistencies (Params)
Mixed PascalCase, camelCase, and all-lowercase in `hugo.toml` params:
- `TocOpen`, `UseHugoToc`, `ShowPubDate` → should be `tocOpen`, `useHugoToc`, `showPubDate`
- `enabledebugpanel` → should be `enableDebugPanel`

### Complexity To Reduce
- `toc.html` — 96 lines of manual heading hierarchy tracking using Scratch; Hugo has a built-in `.TableOfContents`
- `content-header.html` — 12 lines that render one `<h1>`, used in one place, should be inlined
- `single.html` line 4 & 24 — conditional where both branches return the same value (does nothing)
- `picture.html` (partial) — 362 lines adapted from Veriphor; worth auditing for dead paths
- Custom TOC vs `UseHugoToc` — two systems in parallel, one should win

### Gaps / Broken Promises
- `footer-fun.html` doesn't exist but `baseof.html` supports `footerType = "-fun"` — will silently fail
- `archetypes/recipe.md` bug: `recipeInstructions` is a string but `schema-recipe.html` treats it as an array
- CI/CD (GitHub Actions) uses Hugo `0.138.0` but theme requires `0.146+` — masks compatibility bugs
- `package.json` at root: `name = "benstraw"`, `license = "ISC"` (should be MIT), description is a Markdown fragment
- Social links documented as `[[params.social]]` in CLAUDE.md but actual implementation reads `data/social.json`

### Undocumented But Useful
- `[params.twClasses]` block — powerful TailwindCSS class overrides for header/footer, completely hidden
- `cardCategoryColorsDefault`, `homeFeatureWide`, `detailpageURL` — used in templates, undocumented

### Shortcodes: Scope Audit
Shortcodes that belong in a theme:
- `alert-wrapper`, `cta-button`, `font-awesome`, `highlight-github`, `lat-long-box`, `leaflet`, `pass`, `photo-gallery`, `picture`, `recipe-*`, `taxonomy-cloud`

Shortcodes that are personal site utilities, not theme features:
- `alltrails-referral-link`, `amazon-associate-link`, `affiliate-link-builder-form`, `webamp`, `soundcloud` (no demo, no docs)

---

## Rewrite Phases

### Phase 1 — Cut (Delete dead code, remove personal site utilities)
**Status:** Complete — 2026-03-17

- [x] Delete `layouts/partials/old-page_gallery.html`
- [x] Delete `layouts/partials/taxonomy_list.html`
- [x] Delete `layouts/partials/footer-tag-cloud.html`
- [x] Delete `layouts/shortcodes/alltrails-referral-link.html`
- [x] Delete `layouts/shortcodes/webamp.html`
- [x] Remove unused i18n keys (`albums`, `photoCount`, `albumCount`, `in`) from all three language files. Also added missing `toc` key to all three.
- [x] `affiliate-link-builder-form.html` — replaced hardcoded affiliate IDs with `site.Params.amazonAffiliateTags` (string array). Removed unused `productName` Alpine variable. Tag selector only renders if tags are configured.
- [x] `single.html` line 4 — removed pointless conditional where both branches returned `max-w-screen-xl`
- [x] Inlined `content-header.html` into `list.html` and deleted the partial
- [x] `package.json` — fixed `name` (`benstraw` → `ryder`), `description`, `license` (`ISC` → `MIT`), removed spurious `main` field

### Phase 2 — Standardize (Naming, conventions, broken promises)
**Status:** Complete — 2026-03-17

- [x] Rename params to camelCase in templates and exampleSite config: `TocOpen→tocOpen`, `UseHugoToc→useHugoToc`, `ShowPubDate→showPubDate`, `enabledebugpanel→enableDebugPanel`
- [x] Fix `archetypes/recipe.md` (both root and exampleSite) — `recipeInstructions` was a string, now correctly a TOML array of `[[recipeInstructions]]` objects with `name` and `text` fields. Also fixed bare unquoted TOML values in exampleSite version (`recipeCuisine = American` → quoted).
- [x] Social links: confirmed `[[params.social]]` never existed in templates or config — implementation always used `data/social.json`. CLAUDE.md was already corrected in Phase 1 setup. No template changes needed.
- [x] Created `footer-fun.html` — simple single-row flex footer (copyright + socials + dark toggle). The `footerType = "-fun"` param in baseof.html now has a real target.
- [x] CI/CD Hugo version: `0.138.0` → `0.146.0` (matches stated minimum requirement)
- [x] Fix `archetypes/default.md` and `archetypes/recipe.md`: `showTOC` → `showToc` to match template (`.Params.showToc` in single.html)
- [x] Simplify `hidden-home/baseof.html` debug panel condition: `or (.Params.enabledebugpanel) (and (not .Params.enabledebugpanel) (site.Params.enabledebugpanel))` → `.Param "enableDebugPanel"` (standard Hugo cascade)
- [x] Remove stale comment block from `header-fun.html` ("Not sure I'll use those but leave'm for now")

### Phase 3 — Consolidate (Remove duplication)
**Status:** Complete — 2026-03-17

- [x] Merged `menu.html` and `menu-fun.html` into single `menu.html`. Added optional `navClass` param (defaults to `main-menu-nav`; footer menus use `footer-menu-nav`). Deleted `menu-fun.html`. Updated `header-fun.html` to call `menu.html` with `navClass = "main-fun-menu-nav"`. Removed unused `shade` param that was passed but never read.
- [x] Created `utils/card-meta.html` — returning partial (Hugo `return`) that computes all shared card metadata. Both card templates now call it and receive a dict. Each card is only its rendering logic.
- [x] Moved ~275 lines of share-buttons CSS from inline `<style>` block into `assets/css/main.css`. Eliminated the duplicate first color set (which lacked `border-color` and `:active` states). Removed dead Google+ network styles. Dynamic values (`margin`, `font-size`) now use CSS custom properties `--sb-margin` and `--sb-font-size` set by a small remaining `<style>` block.
- [x] Removed dead commented-out navbar toggler CSS from `main.css`

### Phase 4 — Simplify (Reduce complexity)
**Status:** Complete — 2026-03-17

- [x] `toc.html` replaced entirely. The 96-line custom Scratch-based heading tree builder is gone. Now uses Hugo's built-in `.TableOfContents` — 12 lines. The `<details>` wrapper, `tocOpen` param, and i18n title are unchanged. `useHugoToc` param removed from exampleSite config (no longer a choice).
- [x] `picture.html` — audited, left unchanged. All 362 lines are doing real work: responsive multi-format images, optional overlay compositing, page/section/global resource resolution with proper error handling. From Veriphor (Apache 2.0). No dead paths.
- [x] `soundcloud.html` — kept. Added `exampleSite/content/posts/media-embeds.md` with full parameter documentation and a live embed example.
- [x] `openstreetmap.html` — kept. Documented the use case distinction (uMap embed vs Leaflet custom map) in `exampleSite/content/posts/leaflet-maps.md`.

### Phase 6 — Frontend Design Refresh
**Status:** Complete — 2026-03-17

Surgical visual modernization. No new frameworks, no structural changes, no new config parameters. All changes backwards-compatible.

- [x] **Heading typography** — `h1` gets `font-bold tracking-tight`, `h2` gets `font-semibold tracking-tight`. Titillium Web benefits from slight negative tracking at display sizes. `@layer base` keeps specificity low.
- [x] **`.hpContent h2` gradient** — replaced blue→purple→pink rainbow with neutral `from-slate-700 to-slate-500`. Consolidated two duplicate rules into one.
- [x] **Card shadows** — `.article` gets `shadow-sm` + hover `shadow-md` + `rounded-xl`. The outer radius aligns the shadow to the visible card shape (inner `rounded-xl` on `.article-content` was already there).
- [x] **Nav hover + focus** — `main-menu-ul` and `main-menu-child-ul` links get `transition-colors`, hover `text-sky-600 bg-neutral-300`, and `focus-visible` outline ring.
- [x] **Blockquote modernization** — replaced gradient-clip text trick (unreadable in dark mode, WCAG fail) with clean left-bordered blockquote: `border-sky-400 bg-sky-50` light / `border-sky-600 bg-neutral-800` dark. Margin shrinks from 40px to 1em.
- [x] **Link overlay debug border removed** — `border: 5px; border-color: #f505f5` (magenta) stripped from `.article .article-content a.link-overlay`. Was a debug artifact.
- [x] **Card dark mode surface** — `dark:bg-neutral-900` → `dark:bg-neutral-800` in `card-category-color.html`. Cards were invisible against the body in dark mode. Also `rounded-t-xl` → `rounded-xl` on `.article-content` to close the card shape.
- [x] **`card-super-simple` shadow** — outer wrapper gets `shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md` (no `.article` class, so Change 3 didn't cover it).
- [x] **Hamburger hex color** — `text-[#17729C]` → `text-sky-700`. Uses semantic Tailwind token instead of arbitrary hex.
- [x] **Home section headers** — feature and feed `<h2>` elements get `font-bold tracking-wide border-b border-neutral-300 dark:border-neutral-700`. Gives floating uppercase text a visual anchor.
- [x] **Logo hover** — logo box gets `hover:bg-neutral-300 transition-colors duration-150`. Makes the logo feel interactive.

### Phase 5 — Modernize (Improvements for v0.2)
**Status:** Complete — 2026-03-17

- [x] **Dark mode flash fixed.** Added a tiny inline `<script>` at the top of `<head>` (before CSS) that reads `localStorage.theme` and `prefers-color-scheme` and immediately adds the `dark` class to `<html>` if needed. Prevents the flash of light content on dark-mode-preferred page loads. The full `themeSwitcher.js` still handles the 3-way toggle (light/dark/system) after JS loads.
- [x] **`static/leaflet/` removed.** The theme ships Leaflet as an npm dependency (used by `main.js` via `import('leaflet')`), and the CSS is in `assets/css/leaflet.css`. The `static/leaflet/` directory was a redundant manual copy (~300KB) serving no purpose in the build pipeline. Marker images referenced by the CSS are served from `static/css/images/` which remains.
- [x] **`exampleSite/package.json` fixed.** Same issues as root: name, description, license (ISC → MIT), removed spurious `main` field.
- [ ] **`[params.twClasses]` rename** — deferred. The name is not ideal but renaming is a breaking change requiring a migration guide. Document thoroughly instead.
- [ ] **`-fun` variant suffix rename** — deferred. Renaming (`headerType = "-fun"` → something descriptive) is a breaking change for existing users. Flag for v0.2 with clear migration note.

---

## Change Log

### 2026-03-17 — Phase 6: Frontend Design Refresh

**Heading typography (`main.css`):**
- `h1`: added `font-bold tracking-tight`
- `h2`: added `font-semibold tracking-tight`

**`.hpContent h2` gradient simplified:**
- Blue→purple→pink rainbow → neutral `from-slate-700 to-slate-500`
- Two duplicate rules consolidated into one

**Card shadows (`main.css`, `card-category-color.html`, `card-super-simple.html`):**
- `.article` gets `shadow-sm` + hover `shadow-md` + `rounded-xl`
- `card-super-simple` outer wrapper gets the same shadow treatment directly
- `article-content` `rounded-t-xl` → `rounded-xl` to align shadow with card shape

**Card dark mode surface (`card-category-color.html`):**
- `dark:bg-neutral-900` → `dark:bg-neutral-800` — cards were invisible against the body

**Nav hover + focus (`main.css`):**
- Menu links get `transition-colors`, hover `text-sky-600 bg-neutral-300`, `focus-visible` outline ring

**Blockquote modernization (`main.css`):**
- Replaced gradient-clip text (WCAG fail, broken dark mode) with bordered box
- `border-sky-400 bg-sky-50` light / `border-sky-600 bg-neutral-800` dark
- Left margin: 40px → 1em

**Link overlay debug border removed (`main.css`):**
- Stripped `border: 5px; border-color: #f505f5` (magenta debug artifact)

**Hamburger button (`header.html`):**
- `text-[#17729C]` → `text-sky-700` (semantic token)

**Home section headers (`home.html`):**
- Feature and feed `<h2>` get `font-bold tracking-wide border-b border-neutral-300 dark:border-neutral-700`

**Logo hover (`logo.html`):**
- `hover:bg-neutral-300 transition-colors duration-150` added to logo box

---

### 2026-03-17 — Phase 5: Modernize

**Dark mode flash prevention:**
- Added inline `<script>` at top of `<head>` (before CSS loads) that reads
  `localStorage.theme` and `prefers-color-scheme` and immediately adds
  the `dark` class to `<html>` — prevents flash of light content on dark-mode-preferred loads
- `themeSwitcher.js` continues to handle the full 3-way toggle after hydration

**`static/leaflet/` removed (~300KB):**
- Leaflet JS: loaded via npm by Hugo's `js.Build` (`import('leaflet')` in main.js)
- Leaflet CSS: served from `assets/css/leaflet.css` (already in asset pipeline)
- Marker images: served from `static/css/images/` (unchanged, CSS references these)
- `static/leaflet/` was a redundant manual copy with no role in the build

**`exampleSite/package.json` fixed:**
- name, description, license (ISC → MIT), removed spurious `main` field

**Deferred to v0.2:**
- `[params.twClasses]` rename — breaking change, needs migration guide
- `-fun` variant suffix rename — breaking change, needs migration guide

---

### 2026-03-17 — Phase 4: Simplify

**`toc.html` rewritten (96 lines → 12):**
- Custom Scratch-based heading tree removed entirely
- Now uses Hugo's built-in `.TableOfContents`
- `<details>` wrapper, `tocOpen`, and i18n title unchanged
- `useHugoToc` param removed from config (now always Hugo's built-in)

**`picture.html`** — audited, no changes. Justified complexity.

**New `exampleSite/content/posts/media-embeds.md`:**
- Documents `soundcloud` shortcode with full parameter table
- Explains how to find a track's API URL
- Includes a live embed example

**`exampleSite/content/posts/leaflet-maps.md` updated:**
- Added OpenStreetMap (uMap) section explaining when to use it vs Leaflet

---

### 2026-03-17 — Phase 3: Consolidate

**`menu.html` / `menu-fun.html` merged:**
- Single `menu.html` with optional `navClass` param
- `header-fun.html` now calls `menu.html` with `navClass = "main-fun-menu-nav"`
- `menu-fun.html` deleted

**`utils/card-meta.html` created:**
- Returns dict with all computed card metadata via Hugo `return`
- `card-category-color.html` and `card-super-simple.html` each reduced to just rendering logic
- Eliminates ~42 lines of duplicated computation across the two card templates

**Share-buttons CSS externalized:**
- ~275 lines of inline CSS moved to `assets/css/main.css`
- Duplicate first color set removed (it was a subset of the second set, which has `border-color` + `:active`)
- Google+ network CSS removed (service discontinued)
- `--sb-margin` and `--sb-font-size` CSS custom properties replace the two dynamic template values
- `share-buttons.html` `<style>` block reduced from 275 lines to 6

**`main.css` cleanup:**
- Removed commented-out checkbox-based navbar toggler CSS (replaced by Alpine.js years ago)

---

### 2026-03-17 — Phase 2: Standardize

**Param renames (camelCase):**
- `TocOpen` → `tocOpen` (toc.html, exampleSite config)
- `UseHugoToc` → `useHugoToc` (toc.html, exampleSite config)
- `ShowPubDate` → `showPubDate` (page_meta.html, footer.html, exampleSite config)
- `enabledebugpanel` → `enableDebugPanel` (baseof.html, hidden-home/baseof.html, exampleSite config)
- `showTOC` → `showToc` in both archetypes (to match `.Params.showToc` in single.html)

**Recipe archetype bug fixed (both root and exampleSite):**
- `recipeInstructions = "..."` was a string — schema-recipe.html iterates it as an array of objects
- Now uses TOML array of tables: `[[recipeInstructions]]` with `name` and `text` fields
- Also fixed unquoted TOML strings in exampleSite version (`recipeCuisine = American` → `"American"`)

**Created `layouts/partials/footer-fun.html`:**
- Simple single-row flex footer: copyright left, socials + dark toggle right
- `footerType = "-fun"` in config/front matter now has a real target instead of silently failing

**CI/CD:**
- `.github/workflows/hugo.yml`: Hugo version `0.138.0` → `0.146.0`

**`hidden-home/baseof.html`:**
- Replaced `or (.Params.enabledebugpanel) (and (not .Params.enabledebugpanel) (site.Params.enabledebugpanel))` with `.Param "enableDebugPanel"` — equivalent but uses standard Hugo param cascade

**`header-fun.html`:**
- Removed stale comment block ("Not sure I'll use those but leave'm for now")

---

### 2026-03-17 — Phase 1: Cut

**Deleted files (5):**
- `layouts/partials/old-page_gallery.html` — dead code, used FreeJairyGallery (abandoned JS library)
- `layouts/partials/taxonomy_list.html` — contained only a "TODO refactor/delete" comment
- `layouts/partials/footer-tag-cloud.html` — superseded by footer.html, unreferenced
- `layouts/shortcodes/alltrails-referral-link.html` — single-service affiliate link, not a theme feature
- `layouts/shortcodes/webamp.html` — Winamp embed, external CDN dep, never demoed

**i18n cleanup:**
- Removed orphaned keys (`albums`, `photoCount`, `albumCount`, `in`) from `en.toml`, `de.toml`, `fr.toml`
- Added `toc` key to all three language files (was referenced in `toc.html` but only defined in some)

**`affiliate-link-builder-form.html`:**
- Replaced hardcoded `artslink-20`, `benstrawbridge-20`, `grrquarterly-20` with `site.Params.amazonAffiliateTags` (string array in hugo.toml)
- Tag selector only renders when tags are configured
- Removed unused `productName` Alpine.js variable
- Config: `[params] amazonAffiliateTags = ["your-tag-20"]`

**`layouts/_default/single.html`:**
- Line 4: removed `{{ if .Params.hideAsideBar }}max-w-screen-xl{{ else }}max-w-screen-xl{{ end }}` — both branches were identical

**`layouts/partials/content-header.html` → deleted:**
- 12-line partial used in exactly one place (list.html)
- Logic inlined directly into `list.html`

**`package.json`:**
- `name`: `"benstraw"` → `"ryder"`
- `description`: removed Markdown fragment
- `license`: `"ISC"` → `"MIT"` (matches theme.toml)
- Removed `"main": "index.js"` (meaningless for a Hugo theme)
