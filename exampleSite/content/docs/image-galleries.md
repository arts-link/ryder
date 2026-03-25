+++
title = "Image Galleries"
date = 2026-03-23T20:46:00-07:00
draft = true
description = "Create image galleries with a dedicated page layout or the photo-gallery shortcode."
[menu]
 [menu.main]
  weight = 65
  parent = 'docs'
+++

## Two ways to use galleries

Ryder supports image galleries in two forms:

1. A dedicated gallery page using `type = "photo-gallery"`.
2. A `photo-gallery` shortcode that renders images from a shared asset path.

The live sample page is here: [Ryder Gallery](../../ryder-gallery/).

<!--more-->

## Gallery page from a page bundle

Create a directory bundle and put your images next to `index.md`:

```text
content/
  ryder-gallery/
    index.md
    sample-gallery-01.jpeg
    sample-gallery-02.jpeg
    ...
```

Use front matter like this:

```toml
+++
title = "Ryder Gallery"
type = "photo-gallery"
+++
```

The `photo-gallery` layout will automatically load all images in the bundle and render the Alpine lightbox gallery.

## Shortcode usage

If you want to render a gallery inside a normal content page, use the shortcode and point it at an asset path:

```go-html-template
{{</* photo-gallery
  title="Ryder Gallery"
  path="images/ryder-gallery"
*/>}}
```

`path` is optional if you are rendering from page bundle images through the layout, but it is required for the shortcode when you want to load gallery images from a shared folder under `assets/`.

## Notes

- Gallery images are sorted by filename.
- The lightbox supports keyboard navigation and next/previous controls.
- For a clean manual order, use sequential filenames like `sample-gallery-01.jpeg`, `sample-gallery-02.jpeg`, and so on.
