+++
title = 'About Ryder'
date = 2024-01-26T14:32:26-08:00
lastmod = 2026-07-26
description = 'About the Ryder Hugo theme — what it is, what changed in v0.3, and the design principle behind it: a theme should tell you when it fails.'
categories = ['home-page']
[menu]
 [menu.main]
  identifier = 'about'
  weight = 30
+++

## About

Ryder was my Italian Mastiff / Rhodesian Ridgeback dog. He was a good boy. He passed away in 2018, and this theme is dedicated to him.

Ryder is an open source Hugo theme built and maintained by **[Ben Strawbridge](https://www.benstrawbridge.com)**, a project of **[Arts-Link](https://www.arts-link.com)**.

Arts-Link is a small creative studio building digital tools and sites for writers, artists, bands, and independent publishers. Ryder is the theme powering many of those sites — and now it's available for anyone to use.

{{< cta-button
  button_label="View on GitHub"
  button_href="https://github.com/arts-link/ryder"
>}}

<!--more-->

## What changed in v0.3

v0.3 came out of putting Ryder through its first real test: another site consuming it as a pinned git submodule, with its own layouts, its own data, and its own opinions. The shape of that site's workarounds turned out to be a defect report on the theme.

The pattern behind almost every finding was the same. **The theme failed silently.**

- Structured data was emitted with JavaScript comments inside the JSON-LD, so every affected block failed to parse and search engines discarded it. No build error.
- Analytics could resolve to an empty key and render nothing at all, looking exactly like a site with no traffic.
- The theme's Content Security Policy blocked the theme's own embed shortcodes.
- A template variant the changelog said existed had been deleted months earlier, and the code that called it just kept going.

None of these produced an error. Every one of them produced correct-looking HTML.

## The principle

**If the theme can't do what you asked, it should say so.**

That is what v0.3 is really about. Structured data is built from data structures and serialized, so it cannot be malformed by hand. Missing analytics keys warn at build time, and distinguish "you didn't set it" from "your config blocked it." Template variants that don't exist warn and fall back instead of failing cryptically. A development-only linter flags interactive code that the CSP build of Alpine cannot execute — the failure mode that silently broke three features on that first consumer site.

## Extending it without forking it

The other half of v0.3 is seams. Every place that site had to replace a template wholesale, it now has a supported way to extend instead:

- Add structured data types without losing the ones Ryder emits
- Restyle the nav, the page shell, or the body without copying a template
- Hide menu entries when the data behind them is empty
- Swap fonts, favicons, and social icon sets through config
- Ship your own JavaScript through a documented hook, with CSP-safe components for analytics and forms provided

Overriding a Hugo template is easy, permanent, and invisible — your copy wins forever, and never tells you the original moved on. The best extension point is the one that means you never override anything.

Built with TailwindCSS, Alpine.js, and Font Awesome. Licensed MIT.

Upgrading an existing site? See the [v0.3.0 migration guide](https://github.com/arts-link/ryder/blob/main/docs/migration/v0.3.0.md).

Questions or ideas? [Get in touch](../contact) or [open an issue](https://github.com/arts-link/ryder/issues/new/choose).
