+++
title = 'Affiliate Marketing Tools'
date = 2024-06-01T23:19:13-07:00
homeFeatureIcon = "fa-brands fa-amazon"
categories = ["home-page"]
tags = ["affiliate", "amazon", "button"]
showTOC = true
hideAsideBar = true
[menu]
 [menu.main]
  weight = 80
  parent = 'posts'
+++

Two shortcodes for Amazon affiliate links: a single-product buy button and an interactive ASIN link builder.

<!--more-->

## Amazon buy button

The `amazon-associate-link` shortcode renders a yellow Amazon-styled buy button for a single product. Set the `asin` in the page front matter or pass it directly to the shortcode. Configure your affiliate tag once in `hugo.toml`.

**`hugo.toml`:**
```toml
[params]
  amazon_associate_id = "yourtag-20"
```

**In front matter (page-level ASIN):**
```toml
asin = "B08N5WRWNW"
```

**Shortcode:**
{{< highlight go-html-template >}}
{{</* amazon-associate-link button_label="Product Name Here" */>}}
{{< /highlight >}}

Or pass the ASIN directly in the shortcode:
{{< highlight go-html-template >}}
{{</* amazon-associate-link asin="B08N5WRWNW" button_label="Product Name Here" */>}}
{{< /highlight >}}

### Example

{{< amazon-associate-link asin="B08N5WRWNW" button_label="A quick way to add a plug" >}}

---

## Affiliate link builder form

The `affiliate-link-builder-form` shortcode renders an interactive form for building affiliate links on the fly. Enter any ASIN to generate a ready-to-use affiliate link. Useful for building out affiliate content pages.

Configure one or more affiliate tags in `hugo.toml` — multiple tags appear as a dropdown in the form:

```toml
[params]
  amazonAffiliateTags = ["yourtag-20", "yourothersite-20"]
```

**Shortcode:**
{{< highlight go-html-template >}}
{{</* affiliate-link-builder-form */>}}
{{< /highlight >}}

### Example

{{< affiliate-link-builder-form >}}

---

## Finding an ASIN

An ASIN is Amazon's 10-character product identifier. Find it in the product URL after `/dp/`:

{{< figure src="amazon-asin-location.webp" title="Find the ASIN in the URL bar" >}}

You can also find it on any Amazon product page under **Product details → ASIN**.
