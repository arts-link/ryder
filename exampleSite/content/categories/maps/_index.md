+++
title = 'Maps'
date = 2024-05-29T22:58:56-07:00
paginate = 72
# draft = true
# summary = ""
tags = [
  "maps"
  ]
# featured_image = ""
# showTOC = true
[cascade]
  sectionTitle = "Maps on BenStrawbridge.com"
  homeFeatureIcon = "fa-solid fa-map-location-dot"
  cardCategoryColorsDefault = "bg-gradient-to-r from-red-500 to-orange-500"
[menu]
 [menu.main]
  weight = 20
+++

## A category homepage

To create a custom taxonomy list page like this one, just create a directory for the taxonomy, in this case `categories` and the term, here `maps` and create an `index.md` in it with front matter like this:

{{< cta-button 
  button_label="a lot of fun stuff over there" 
  button_relref="/posts/alerts" 
>}}

<!--more-->

{{< highlight html >}}
+++
title = 'Maps'
date = 2024-05-29T22:58:56-07:00
paginate = 72
# draft = true
# summary = ""
categories = ["maps"]
tags = [
  "maps"
  ]
# featured_image = ""
# showTOC = true
[cascade]
  sectionTitle = "Recipe Ingredients on BenStrawbridge.com"
  homeFeatureIcon = "fa-solid fa-wheat-awn"
  cardCategoryColorsDefault = "bg-gradient-to-r from-red-500 to-orange-500"
+++
{{< /highlight>}}



