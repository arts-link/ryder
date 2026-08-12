+++
title = 'Featured Content'
date = 2024-02-21T15:03:39-08:00
description = 'Pin posts to the featured grid on the home page using the homeFeature front matter param.'
homeFeature = true
# homeFeatureWide = true
homeFeatureTitle = "Featured Content"
homeFeatureIcon = "fa-solid fa-om"
homeFeatureSummary = "Ryder gives you a couple ways to feature content on the home page, and a way to write the card blurb yourself instead of letting Hugo truncate one."
Weight = 9999
[menu]
 [menu.main]
  weight = 20
  parent = 'docs'
+++
## Lead with a wide feature

If you want to have wide features, they will get stacked at the top and will take 2 columns. This is done by setting a front matter param `homeFeatureWide` to enable it, and adding an `order-first` class and `col-span-2` class to the outer div.

<!--more-->

By adding the `homeFeature` param to your front matter you can have the post show up at the top of the home page of your website.

## Front Matter

```
+++
homeFeature = true
homeFeatureWide = true
homeFeatureTitle = "Debug Panel"
homeFeatureIcon = "fa-solid fa-binoculars"
homeFeatureSummary = "The blurb this card shows, written by you."
+++
```

If you don't have this front matter there, the boxes will not show up at all.  This can be used for both regular pages, `index.md` template, and list page `_index.md` template.

### Writing the card blurb

Without `homeFeatureSummary`, a card falls back to Hugo's `.Summary` — your
`<!--more-->` excerpt, or an automatic truncation of the page at `summaryLength`
words when there is no marker. Cards render that as plain text, because an
automatic truncation can end in the middle of nested markup. Set
`homeFeatureSummary` when you want to write the blurb yourself; this page does.
