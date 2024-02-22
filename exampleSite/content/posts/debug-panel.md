+++
title = 'Debug Panel'
date = 2024-02-03T22:42:50-08:00
# draft = true
enabledebugpanel = true 
homeFeature = true
homeFeatureTitle = "Debug Panel"
homeFeatureIcon = "fa-solid fa-binoculars"
tags = ["debug","hugo"]
[menu]
 [menu.main]
  weight = 8
  parent = 'posts'
+++

I made a wrapper around this debug-hugo partial from [kaushalmodi](https://github.com/kaushalmodi/hugo-debugprint/blob/master/layouts/partials/debugprint.html)

To turn it on, set enabledebugpanel = true in front matter, or add the same variable to the site params.

```
[params]
  # defaults to false if not set.
  enableDebugPanel = true 
```

It is set to true fore this page. You can drag it around, and close it with a double click.