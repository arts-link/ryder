+++
title = "Table of Contents"
date = 2026-03-26T15:12:00-07:00
description = "Use the built-in aside table of contents on longer pages with a clear heading structure."
tags = ["toc", "navigation", "docs"]
showToc = true
tocOpen = true
[menu]
 [menu.main]
  weight = 67
  parent = 'docs'
+++

## Why use a table of contents

The built-in TOC is useful on pages with real hierarchy. It works best when the content has more than a flat list of `##` headings and gives the reader a clear path through the page.

### Good fit

Use the TOC when a page has:

- several sections
- nested subsections
- longer technical or reference content

### Bad fit

Skip it on short pages where the heading structure is shallow and the aside would feel decorative rather than helpful.

## How to enable it

Turn the TOC on in front matter:

```toml
+++
title = "My Page"
showToc = true
tocOpen = true
+++
```

### `showToc`

This tells the single-page layout to render the TOC rail.

### `tocOpen`

This is kept for compatibility with older TOC behavior. The current aside TOC is always visible when enabled, so you can treat it as optional legacy config.

## Writing content that produces a useful TOC

The TOC is generated from your headings, so structure matters.

### Keep the levels orderly

Move from `##` to `###` in a predictable way. Avoid jumping levels unless the content truly needs it.

### Use meaningful section names

Headings like “Overview,” “Configuration,” and “Examples” are more useful in a TOC than vague labels.

### Don’t over-nest

One nested level is usually enough for docs and editorial pages.

## Example section structure

Here is the kind of shape that works well:

### Overview

Explain the feature and why it exists.

### Configuration

Show the key front matter or site params needed to turn it on.

### Content guidance

Describe what kind of page structure produces a readable TOC.

## Design note

The TOC in Ryder is intended to feel like part of the aside system, alongside tags and other page utilities, rather than like a floating browser-default disclosure widget.
