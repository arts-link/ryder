+++
title = 'Cta Button'
date = 2024-06-20T14:17:05-07:00
# draft = true
# summary = ""
# categories = [""]
# tags = [""]
# featured_image = ""
homeFeature = true
# showTOC = true
[menu]
 [menu.main]
  weight = 45
  parent = 'posts'
+++

## Easily add a call to action

> C.T.A. buttons now take on the characteristic of the category style

{{< cta-button 
  button_label="CTA Buttons Take you places!"
  button_relref="/posts/alerts"
>}}

<!--more-->

Just add this shortcode to your content page. Use `button_relref` for local to the hugo site links, or `button_href` for full urls with the `https://` included.

{{< highlight go-html-template >}}
{{</* cta-button 
  button_label="CTA Buttons Take you places!"
  button_relref="/posts/alerts"
*/>}}
{{< /highlight >}}
