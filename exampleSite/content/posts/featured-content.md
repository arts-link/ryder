+++
title = 'Featured Content'
date = 2024-02-21T15:03:39-08:00
homeFeature = true
# homeFeatureWide = true
homeFeatureTitle = "Featured Content"
homeFeatureIcon = "fa-solid fa-om"
Weight = 9999
# draft = true
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
+++
```

If you don't have this front matter there, the boxes will not show up at all.  This can be used for both regular pages, `index.md` template, and list page `_index.md` template.
