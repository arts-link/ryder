+++
title = 'Featured Content'
date = 2024-02-21T15:03:39-08:00
homeFeature = true
homeFeatureTitle = "Featured Content"
homeFeatureIcon = "fa-solid fa-om"
Weight = 9999
# draft = true
+++

{{< alert-wrapper alertType="danger" alertTitle="Under Construction" alertMessage="This Feature is in development, currently it works, but the home page display is clearly not good! You could edit the home.html template to fix them up."  alertIconClass="fa-solid fa-person-digging" >}}

By adding these params to your front matter you can have the post show up in a special box on the home page of the website.

## Front Matter

```
+++
homeFeature = true
homeFeatureTitle = "Debug Panel"
homeFeatureIcon = "fa-solid fa-binoculars"
+++
```

If you don't have this front matter there, the boxes will not show up at all.  This can be used for both regular pages, `index.md` template, and list page `_index.md` template.