+++
title = 'Featured Content'
date = 2024-02-21T15:03:39-08:00
homeFeature = true
homeFeatureTitle = "Featured Content"
homeFeatureIcon = "fa-solid fa-om"
Weight = 9999
# draft = true
+++

By adding the `homeFeature` param to your front matter you can have the post show up at the top of the home page of your website.

> C.T.A. buttons now take on the characteristic of the category style

{{< cta-button 
  button_label="CTA Buttons Take you places!"
  button_relref="/posts/alerts"
>}}

<!--more-->

## Front Matter


```
+++
homeFeature = true
homeFeatureTitle = "Debug Panel"
homeFeatureIcon = "fa-solid fa-binoculars"
+++
```

If you don't have this front matter there, the boxes will not show up at all.  This can be used for both regular pages, `index.md` template, and list page `_index.md` template.
