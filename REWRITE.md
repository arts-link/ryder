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
- `footerLayout = "stacked"` param — exists in footer.html, not documented anywhere
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
**Status:** Not started

- [ ] Evaluate `toc.html` — migrate to Hugo built-in or dramatically simplify
- [ ] Audit `picture.html` partial (362 lines) for dead code paths
- [ ] Decide on `soundcloud.html` — document with example or delete
- [ ] Decide on `openstreetmap.html` — document with example or delete (vs leaflet.html)

### Phase 5 — Modernize (Improvements for v0.2)
**Status:** Not started

- [ ] Fix dark mode initial flash (data attribute + CSS custom properties approach)
- [ ] Improve `[params.twClasses]` documentation and potentially rename to something more intuitive
- [ ] Consider whether Leaflet (300KB) belongs in static/ or should be documented as an optional install
- [ ] Rename `-fun` variant suffix to something that communicates what it does

---

## Change Log

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

