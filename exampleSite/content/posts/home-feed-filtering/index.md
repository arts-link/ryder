+++
title = 'Home Feed Filtering and Colorization'
date = 2024-06-10T20:41:19-07:00
# draft = true
# summary = ""
# categories = [""]
hideAsideBar = true
tags = [
  "filtering",
  "feed"
  ]
# featured_image = ""
homeFeatureIcon = "fa-solid fa-house"
# showTOC = true
+++

## Limit your home page feed by Section, Category or Tag

You can now set params in your `hugo.toml` file to keep any pesky pages off your homepage that you may not wish to promote for whatever reason.

<!--more-->

{{< highlight go-html-template >}}
  # homepage list exclusion... 
  excludedSections = ["fineprint", "portfolio", "goals"]
  excludedCategories = ["catalog","recipes"]
  excludedTags = ["excluded"]
{{< /highlight >}}

### How does it work?

> {{< font-awesome "text-neutral-900 dark:text-neutral-100 fa-solid fa-wand-magic-sparkles" >}} Magic 

## Express yourself with colorful cards

There is a new default partial called `card-category-color.html` and it is the new layout for all lists in the site. In addition you can control your colors all through the front matter or configuration.

You set your base default color / gradient using tailwindcss classes in `hugo.toml`, then you can override that color on a per section or per category basis. For instance on this exampleSite, no base color has been set in the `hugo.toml` file, so it falls back on the hardcoded default of a gray gradient.

{{< highlight go-html-temlplate >}}
{{ $headerStyle := default "bg-gradient-to-r from-zinc-400 to-zinc-300" (.Param "cardCategoryColorsDefault") }}
{{< /highlight >}}

For further color configuration look to the default pages you can create for categories and sections by creating that `_index.md` file and adding some param for it -- like so. Putting it in the cascade ensures all it's children receive the gift.

{{< highlight go-html-temlplate >}}
[cascade]
  sectionTitle = "Maps on BenStrawbridge.com"
  cardCategoryColorsDefault = "bg-gradient-to-r from-red-500 to-orange-500"
{{< /highlight >}}