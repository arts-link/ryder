+++
# LOOK AT THIS --- https://developers.google.com/search/docs/appearance/structured-data/recipe

title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = {{ .Date }}
draft = true
# summary = ""
# categories = [""]
# tags = [
  # ""
  # ]
# featured_image = ""
# showToc = true

recipe = true
recipeCuisine = "American"
prepTime = "PT20M"
cookTime = "PT20M"
totalTime = "PT20M"
recipeYield = ["4 servings"]
calories = 0
recipeIngredient = [
  "1 cup example ingredient",
]

[[recipeInstructions]]
  name = "Step one title"
  text = "Describe what to do in this step."

[[recipeInstructions]]
  name = "Step two title"
  text = "Describe what to do in this step."
+++

## Ingredients

- ...

or 
### Base 
- ...

## Method

...

## Tips

... (optional)