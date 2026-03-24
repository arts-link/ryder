+++
title = 'Logo Configuration'
date = 2024-06-15T10:00:00-07:00
homeFeatureIcon = "fa-solid fa-image"
tags = ["hugo","logo","configuration"]
[menu]
 [menu.main]
  weight = 75
  parent = 'posts'
+++

The Ryder theme supports two logo styles: a **text mark** (the default) and a **custom image**. Both are configured entirely in `hugo.toml` — no template edits required.

<!--more-->

## Text logo (default)

The default logo renders two coloured words side-by-side. The first word is displayed in sky-blue and the second in lime-green.

```toml
[params]
  logo_firstWord = "my"
  logo_lastWord  = "site"
  logo_tagline   = "FOR HUGO WEBSITES"
```

If neither `logo_firstWord` nor `logo_lastWord` is set, the theme automatically splits `title` on the first space and uses those two words.

### Optional text-logo params

| Param | Type | Description |
|---|---|---|
| `logo_fontClass` | string | Tailwind CSS font-family class applied to the logo text (e.g. `"font-titillium"`) |
| `logo_collapse` | bool | When `true` the logo collapses to initials only on small screens |
| `logo_tagline` | string | Small all-caps label below the words |

```toml
[params]
  logo_firstWord = "ryder"
  logo_lastWord  = "theme"
  logo_tagline   = "FOR HUGO WEBSITES"
  logo_fontClass = "font-titillium"
  logo_collapse  = true
```

## Image logo

To replace the text mark with your own image:

1. Copy your logo file into your site's `static/images/` directory:

   ```
   your-site/
   └── static/
       └── images/
           └── logo.png
   ```

2. Add `logo_png` to `[params]` in `config/_default/hugo.toml`:

   ```toml
   [params]
     logo_png = "/images/logo.png"
   ```

The image is rendered at a maximum height of 4 rem; width scales automatically. Any web-safe format works — `.png`, `.svg`, `.webp`, `.jpg`.

### Combining an image with a tagline

`logo_tagline` still appears below the image when `logo_png` is set:

```toml
[params]
  logo_png     = "/images/logo.svg"
  logo_tagline = "YOUR TAGLINE HERE"
```

## Summary of logo params

| Param | Default | Description |
|---|---|---|
| `logo_firstWord` | first word of `title` | First word of the text mark |
| `logo_lastWord` | second word of `title` | Second word of the text mark |
| `logo_tagline` | _(none)_ | Small label shown below words or image |
| `logo_fontClass` | _(none)_ | Tailwind font class for the text mark |
| `logo_collapse` | `false` | Collapse text to initials on mobile |
| `logo_png` | _(none)_ | Path to a logo image; hides the text mark when set |
