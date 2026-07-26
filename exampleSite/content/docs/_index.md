+++
title = "Docs"
description = "Documentation pages to show how that might look."
date = "2024-01-24"
author = "Hugo Authors"
enableComments = false
# headerType = "-custom"
[cascade]
  # showCardLinkOverlay = false
  homeFeatureIcon = "fa-solid fa-signs-post"
  cardCategoryColorsDefault = "bg-gradient-to-r from-violet-400 to-pink-400"
  showReadOn = true
[menu]
 [menu.main]
  weight = 32
  name = 'Docs'
  identifier = 'docs'
  [menu.main.params]
    submenuTrigger = 'button'
+++

{{< alert-wrapper 
  alertType="info" 
  alertTitle="Template overrides" 
  alertMessage="Use keys like `headerType = '-custom'` or `footerType = '-custom'` to load your own suffixed partials, such as `layouts/partials/header-custom.html`, without editing the theme's base layout." 
  alertIconClass="fa-solid fa-snowflake"
  dismissable=false
>}}


A list of all your content under docs will go here on this paginated section. If you only want to show the docs, just have no content on the `_index.md` file, or remove it completely if you don't need to set any front matter variables.

<!--more-->
