+++
title = 'SEO & GEO — Structured Data & Search Optimization'
date = 2025-03-25T00:00:00-08:00
description = "Built-in SEO and GEO support with OpenGraph, schema.org JSON-LD, and structured data — zero plugins required."
homeFeature = true
homeFeatureTitle = "SEO & GEO"
homeFeatureIcon = "fa-solid fa-globe"
tags = ["seo", "geo", "schema", "json-ld", "opengraph"]

[menu]
 [menu.main]
  weight = 85
  parent = 'docs'

+++

Ryder ships with a full-stack SEO and GEO implementation out of the box — no plugins, no extra config required. Every page gets the right structured data automatically.

<!--more-->

## What is SEO?

**Search Engine Optimization (SEO)** is the practice of making your content easier for search engines like Google, Bing, and DuckDuckGo to find, understand, and rank. Good SEO is not just keywords — it's about giving search engines rich, reliable signals about who wrote a page, what it's about, when it was published, and how it fits into your site's structure.

Modern SEO best practices include:

- **Meta descriptions** — short page summaries shown in search result snippets
- **Open Graph tags** — structured social sharing metadata understood by Facebook, LinkedIn, and others
- **Twitter / X Cards** — card-style previews in social feeds
- **JSON-LD structured data** — machine-readable Schema.org annotations embedded in the `<head>` of every page

## What is GEO?

**Generative Engine Optimization (GEO)** is the emerging counterpart to traditional SEO. As AI-powered search tools (ChatGPT, Perplexity, Google AI Overviews, Gemini) increasingly answer questions by synthesising information from across the web, your content needs to be structured so these models can understand and accurately cite it.

GEO means:

- **Clear authorship** — letting AI know who wrote the content and where it comes from
- **Semantic markup** — using Schema.org types so AI can identify what kind of page this is
- **Structured facts** — ingredients, steps, dates, keywords baked into machine-readable JSON-LD rather than buried in unstructured prose
- **Trustworthy signals** — consistent publisher information, canonical URLs, and publication dates

Ryder handles all of this automatically through its schema and meta-tag pipeline.

---

## What Ryder Generates Automatically

You don't need to configure anything. Every page Ryder builds gets the following metadata in its `<head>`:

### 1. Meta Description

Ryder looks for a description in this priority order:

1. The page's `description` front matter field
2. The page's auto-generated Hugo summary
3. The site-level `description` in `hugo.toml`

```html
<meta name="description" content="Your page summary here." />
```

### 2. Open Graph Tags

Every page gets a full Open Graph block — the social sharing metadata used by Facebook, LinkedIn, Slack, Discord, and most link-preview systems.

| Tag | Value |
|---|---|
| `og:url` | Canonical permalink |
| `og:site_name` | Your site title |
| `og:title` | Page title |
| `og:description` | Description (same cascade as above) |
| `og:locale` | From `site.Language.LanguageCode` |
| `og:type` | `article` for pages, `website` for sections/home |
| `og:image` | Featured image (see below) |
| `article:published_time` | ISO 8601 publish date |
| `article:modified_time` | ISO 8601 last-modified date |
| `article:section` | Hugo section name |
| `article:tag` | First 6 tags from front matter |

Optional tags that fire when set in front matter:

- `og:audio` — from `.Params.audio`
- `og:video` — from `.Params.videos`
- `og:see_also` — from pages in the same `series` taxonomy
- `fb:app_id` / `fb:admins` — from `[params.social].facebook_app_id`

### 3. Twitter / X Cards

When a featured image is found, Ryder outputs a `summary_large_image` card — the large-format preview that makes links stand out in feeds. Without an image it falls back to a `summary` card.

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://example.com/posts/my-post/feature.webp" />
<meta name="twitter:title" content="My Post Title" />
<meta name="twitter:description" content="Short description." />
<meta name="twitter:site" content="@yourtwitterhandle" />
```

Set your Twitter/X handle in `hugo.toml`:

```toml
[params.social]
  twitter = "yourtwitterhandle"
```

### 4. Dynamic OG Image Generation

No featured image? No problem. Ryder auto-generates an Open Graph image at build time by overlaying your page title (and site name) onto a base image. The image is baked into your static output — no server-side rendering needed.

To use a custom base image, drop a file into your site's `assets/` and set:

```toml
[params]
  og_image_default = "images/og-default.webp"
```

To customise the generated text style:

```toml
[params.ogImageText]
  fontName  = "TitilliumWeb-Regular"   # font file in assets/common-partials/opengraph/
  fontColor = "#085624"
  x = 50
  y = 430
```

The title font size scales automatically — smaller text for longer titles.

---

## JSON-LD Structured Data

Ryder emits Schema.org JSON-LD blocks in the `<head>` of every page. These are the annotations that AI search tools, Google's rich-result system, and modern crawlers use to understand your content.

### WebPage (homepage)

The home page gets a `WebPage` schema with full authorship and publisher data:

```json
{
  "@context": "https://schema.org/",
  "@type": "WebPage",
  "name": "My Site",
  "url": "https://example.com/",
  "inLanguage": "en",
  "isFamilyFriendly": "true",
  "copyrightYear": "2025",
  "copyrightHolder": "Your Name",
  "author": { "@type": "Person", "name": "Your Name", "email": "you@example.com", "url": "https://example.com/" },
  "publisher": { "@type": "Organization", "name": "Your Name", "url": "https://example.com/", "logo": "..." }
}
```

### Organization (homepage)

Alongside the `WebPage` block, the home page also gets an `Organization` schema — the entity-level signal that tells search engines and AI who publishes the site:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://example.com/",
  "logo": "https://example.com/images/logo.png",
  "name": "My Site",
  "email": "you@example.com"
}
```

### BlogPosting (all other pages)

Every non-home page gets a `BlogPosting` schema — article-level metadata that powers rich snippets and AI citation attribution:

```json
{
  "@context": "http://schema.org",
  "@type": "BlogPosting",
  "headline": "My Article Title",
  "url": "https://example.com/posts/my-article/",
  "datePublished": "2025-01-15T10:00:00-08:00",
  "dateModified": "2025-01-20T10:00:00-08:00",
  "inLanguage": "en",
  "isFamilyFriendly": "true",
  "author": { "@type": "Person", "name": "Your Name" },
  "publisher": { "@type": "Organization", "name": "Your Name", "logo": "..." },
  "description": "Short description of the article.",
  "keywords": ["tag1", "tag2"]
}
```

Front matter fields that feed directly into this schema:

| Front matter | Schema field |
|---|---|
| `title` | `headline` |
| `description` | `description` |
| `date` | `datePublished` |
| `lastmod` | `dateModified` |
| `tags` | `keywords` |

### BreadcrumbList (all non-home pages)

Every page also gets a `BreadcrumbList` schema — the trail of links from home to the current page. Google uses this for breadcrumb-style rich snippets in search results.

Ryder generates two `BreadcrumbList` blocks per page: one derived from the page's `categories` front matter, and one from the Hugo section/ancestor hierarchy.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Docs", "item": "https://example.com/docs/" },
    { "@type": "ListItem", "position": 3, "name": "This Page", "item": "https://example.com/docs/this-page/" }
  ]
}
```

---

## Recipe Schema

Pages with `recipe = true` in front matter get a full Schema.org `Recipe` block — the structured data that powers Google's recipe rich results (ingredient lists, cook times, ratings, and step-by-step cards).

```toml
recipe = true
recipeCuisine = "Breakfast"
prepTime = "PT10M"
cookTime = "PT30M"
totalTime = "PT40M"
recipeYield = "4 servings"
calories = 350

recipeIngredients = [
  "2 cups oats",
  "1 tbsp chia seeds",
]

[[recipeInstructions]]
  name = "mix"
  text = "Combine all dry ingredients."
[[recipeInstructions]]
  name = "bake"
  text = "Spread on a baking sheet and bake at 325°F for 25 minutes."
```

The generated schema includes `recipeIngredient`, `recipeInstructions` (as `HowToStep` objects with individual URLs), `nutrition`, `prepTime`, `cookTime`, `totalTime`, `recipeYield`, `author`, and `datePublished`.

See the full example: [Lemon Chia Granola recipe](/docs/recipe-lemon-chia-granola/).

---

## Putting It All Together

Here is what a typical Ryder post's `<head>` delivers to search engines and AI crawlers:

- `<meta name="description">`
- `og:url`, `og:title`, `og:description`, `og:image`, `og:type`
- `article:published_time`, `article:modified_time`, `article:tag`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- JSON-LD: BlogPosting (authorship, dates, keywords, full article body)
- JSON-LD: BreadcrumbList (section + category trails)
- JSON-LD: WebPage + Organization (home page only)
- JSON-LD: Recipe (recipe pages only)

All of this is built from the content and config you have already written — no extra front matter, no third-party plugins, no CDN calls.

---

## Tips for Getting the Most Out of Ryder's SEO

- **Write a good description.** Set `description` in front matter for important pages. It shows in both meta tags and JSON-LD.
- **Use tags.** Tags become `article:tag` OG properties and `keywords` in your `BlogPosting` JSON-LD.
- **Add a featured image.** Name it with `feature`, `cover`, or `thumbnail` in the filename and place it in the page bundle. It becomes the `og:image`, Twitter card image, and schema image.
- **Set your author name and email** in `[params.author]` in `hugo.toml` — these flow into every schema block as `Person` and `Organization` entities.
- **Set your Twitter/X handle** via `[params.social].twitter` to get `twitter:site` on every page.
- **Use `categories` in front matter** — they generate a second `BreadcrumbList` from the taxonomy path.
