+++
title = 'About Ryder'
date = 2024-01-26T14:32:26-08:00
lastmod = 2026-07-26
description = 'The Ryder Hugo theme: v0.3.0 release notes, new configuration parameters, breaking changes, and upgrade path.'
categories = ['home-page']
[menu]
 [menu.main]
  identifier = 'about'
  weight = 30
+++

## About

Ryder was my Italian Mastiff / Rhodesian Ridgeback dog. He was a good boy. He passed away in 2018, and this theme is dedicated to him.

Ryder is an open source Hugo theme built and maintained by **[Ben Strawbridge](https://www.benstrawbridge.com)**, a project of **[Arts-Link](https://www.arts-link.com)**. Built with TailwindCSS, Alpine.js, and Font Awesome. Licensed MIT.

Requires Hugo **extended** ≥ 0.146.0.

{{< cta-button
  button_label="View on GitHub"
  button_href="https://github.com/arts-link/ryder"
>}}

<!--more-->

## v0.3.0 release notes

Four breaking changes. Upgrade from v0.2.5, one release at a time — see the [migration guide](https://github.com/arts-link/ryder/blob/main/docs/migration/v0.3.0.md).

### Structured data (2.2)

`head/schema.html` is rebuilt to construct Hugo `dict`s and `jsonify` them rather than hand-writing JSON as template text. Three differing homepage tests collapse to `.IsHome`. `articleBody`, which inlined the entire rendered page body into every `BlogPosting`, is removed. Dates emit as RFC 3339. Breadcrumbs emit as separate script blocks.

`head/schema-recipe.html` receives the same rewrite.

| Addition | Purpose |
|---|---|
| `head/schema-extra.html` | No-op hook called from `head-seo.html`, shadowed from your `layouts/`. Adds JSON-LD types without overriding `head/schema.html` |
| `params.schema.type` | Site-wide entity on the home page. Default `"Organization"`; accepts `MusicGroup`, `Person`, `LocalBusiness`, etc. |

Overriding `head/schema.html` costs you `WebPage`, `BlogPosting`, the site entity, and both `BreadcrumbList` blocks, with no build error. Use the hook.

### Content Security Policy (4.3)

The PostHog bootstrap is compiled with `resources.FromString | js.Build | fingerprint` and loaded via `src` + `integrity` instead of being inlined. `script-src` no longer receives `'unsafe-inline'` as a side effect of enabling analytics.

| Addition | Purpose |
|---|---|
| `params.csp.scriptSrcHashes` | SHA-256 hashes for your own inline scripts |

The policy ships as a `<meta http-equiv>` tag, and a meta-delivered CSP cannot carry a nonce — hashes are the only way to permit one inline script without permitting all of them. `style-src` retains `'unsafe-inline'` deliberately; Alpine's `x-show` writes inline styles.

### Build and packaging (3.1–3.4)

| Change | Detail |
|---|---|
| `tailwind.preset.js` | New. Carries `theme`, `darkMode`, `plugins`; deliberately no `content`. `tailwind.config.js` is now a thin wrapper holding only this repo's dev globs |
| `fontFamily.titillium` | Resolves through `var(--ryder-font-family, "Titillium Web")`, so `font-titillium` follows `[params.fonts]` instead of contradicting it |
| `assets/css/style.css` | Deleted. A committed build artifact no template read |
| `build-tw` / `watch-tw` / `deploy-tw` | Deleted. Tailwind compiles inside the Hugo build via `css.PostCSS` |
| `[outputs]` | Documented as **required in your own config**. `outputFormats` is inherited from the theme; `outputs` is not — without your own block, `llms.txt` is not written |

The same applies to `[build]`: not inherited. Without `writeStats = true` and cachebusters in your config, Tailwind falls back to scanning `layouts/**/*.html` and any dynamically-assembled class is purged.

### Breaking changes

| # | Change | Fails at | Action |
|---|---|---|---|
| 1 | `*-tw` scripts deleted | Build command | Drop `npm run build-tw &&`; `hugo --minify` alone suffices. Install `tailwindcss@^3.4.0`, `postcss`, `postcss-cli`, `autoprefixer` at your project root |
| 2 | `script-src` drops `'unsafe-inline'` | Visitor's browser | Add each inline script's SHA-256 to `params.csp.scriptSrcHashes`, move it to `assets/js/extended.js`, or set `params.csp.scriptSrc` explicitly |
| 3 | JSON-LD output changes shape | Nothing — verify manually | Delete any `head/schema.html` override; use `schema-extra.html` and `params.schema.type`. Revalidate at Google's Rich Results Test |
| 4 | Tailwind config becomes a preset | Build, immediately | Use `presets: [require('./themes/ryder/tailwind.preset.js')]` and declare your own `content` |

Breaking change 2 is the one to test deliberately: CSP violations do not fail builds. Verify with a production build and a browser console showing zero violations.

## Configuration added in v0.2.4–v0.3.0

| Parameter | Since | Purpose |
|---|---|---|
| `params.darkMode` | v0.2.4 | `"toggle"` / `"system"` / `"off"`. `"off"` skips the boot script and emits no `dark:` variants |
| `params.csp.embeds` | v0.2.4 | Preset allowing known embed hosts in `frame-src` |
| `params.twClasses.body` / `.bodyDark` | v0.2.5 | `<body>` classes. Separate params so customizing the body cannot silently disable dark mode |
| `params.twClasses.nav` | v0.2.5 | Nav skin, page-overridable — restyle the nav without forking `header.html` |
| `params.favicon` | v0.2.5 | `ico`, `version`, `svg`, `appleTouchIcon`, `webmanifest`, plus `[[params.favicon.icons]]` for sized PNGs |
| `params.fonts` | v0.2.5 | `family`, `googleFontsFamily`, `disableGoogleFonts` |
| `og_image` | v0.2.5 | Front-matter per-page OG image, checked before the bundle-resource chain |
| `hideIfEmptyData` | v0.2.5 | Under `[menus.<id>.params]`; hides an entry when the named data file has no items |
| `params.schema.type` | v0.3.0 | Site-wide schema.org entity type |
| `params.csp.scriptSrcHashes` | v0.3.0 | SHA-256 allowances for your own inline scripts |

## Components and shortcodes

| Name | Since | Notes |
|---|---|---|
| `ryderTrack` | v0.2.5 | `Alpine.data()` click tracking via `data-track-event` / `data-track-props` |
| `ryderForm` | v0.2.5 | JSON POST to `data-form-action`, `status` plus boolean getters, `_gotcha` honeypot |
| `cspLint.js` | v0.2.5 | Development-only console linter for Alpine directives the CSP build cannot evaluate |
| `youtube-embed`, `spotify-embed` | v0.2.5 | Register their iframe hosts in `frame-src` automatically |
| `video-lightbox` | v0.2.5 | `src` set only when the modal opens |
| `_default/list-plain.html` | v0.2.5 | Title + `.Content`, no pagination — for data-driven singleton sections |
| `utils/data-items.html` | v0.2.5 | Returning partial for the `.Site.Data.<name>.items` idiom |

The theme bundles the CSP build of Alpine, which cannot evaluate member calls or arrow functions in inline directives and does not throw when it meets one. Use registered `Alpine.data()` components; `assets/js/extended.js` is the supported hook for your own JavaScript.

Questions or ideas? [Get in touch](../contact) or [open an issue](https://github.com/arts-link/ryder/issues/new/choose).
