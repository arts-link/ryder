+++
title = "Posts"
description = "Posts to show how that might look."
date = "2024-01-24"
author = "Hugo Authors"
enableComments = false
listCardType = "-super-simple" # "-fun" or "-custom" to make your own
# headerType = "-fun" 
[cascade]
  # showCardLinkOverlay = false
  homeFeatureIcon = "fa-solid fa-signs-post"
  cardCategoryColorsDefault = "bg-gradient-to-r from-violet-400 to-pink-400"
  showReadOn = true
[menu]
 [menu.main]
  weight = 32
  identifier = 'posts'
+++

{{< alert-wrapper 
  alertType="info" 
  alertTitle="Alternate header options" 
  alertMessage="This page has the `headerType` front matter key set to `-fun`, which causes a different header layout to be loaded, this can be set in page front matter or globally in `hugo.toml`." 
  alertIconClass="fa-solid fa-snowflake"
  dismissable=false
>}}


A list of all your content under posts will go here on this paginated section. If you only want to show the posts, just have no content on the `_index.md` file, or remove it completely if you don't need to set any front matter variables.

<!--more-->