+++
title = 'Alerts'
date = 2024-01-26T12:55:50-08:00
# draft = true
homeFeature = true
homeFeatureTitle = "Alert boxes"
homeFeatureIcon = "fa-solid fa-dungeon"
[menu]
 [menu.main]
  weight = 1
  parent = 'posts'

+++

## The global alert

This is setup in your `hugo.toml` configuration file. Multiple banners will be displayed for however many `[[params.alphaAlert]]` blocks you configure. 
```toml
[params]
  isAlpha = true
[[params.alphaAlert]]
  alertType = "danger"
  alertTitle = "Special Banner add-on included"
  alertMessage = "This theme is a work in progress!"
  alertIconClass = "fa-solid fa-camera-retro"
```

For `alertType` options include:
- `info` (blue)
- `success` (green)
- `warning` (yellow)
- `danger` (red)
- `dark` (dark)  

It defaults to `dark`.

For `alertIconClass` any [fontawesome-free icon class](https://fontawesome.com/search?o=r&m=free) will work.

## From the content directory, called as a shortcode.

All of the params are optional, but if neither alertTitle or alertMessage are passed they will not render. The `alertIconClass` must be a valid [fontawesome icon class](https://fontawesome.com/search?o=r&m=free).

```go
{{</* alert-wrapper 
  alertType="info" 
  alertTitle="will" 
  alertMessage="robinson" 
  alertIconClass="fa-solid fa-snowflake"
*/>}}
```

## Alert shortcode examples:
  
### Info: 

Uses `fa-solid fa-snowflake`.

{{< alert-wrapper alertType="info" alertTitle="will" alertMessage="robinson <a href='/posts/alerts'>test</a>" alertIconClass="fa-solid fa-snowflake">}}  

### Success: 

Uses `fa-solid fa-bicycle`.

{{< alert-wrapper alertType="success" alertTitle="will" alertMessage="robinson" alertIconClass="fa-solid fa-bicycle" >}}  

### Warning: 

Uses `fa-solid fa-bath`.

{{< alert-wrapper alertType="warning" alertTitle="will" alertMessage="robinson" alertIconClass="fa-solid fa-bath" >}}  

### Danger: 

Uses `fa-solid fa-dumpster-fire`.

{{< alert-wrapper alertType="danger" alertTitle="will" alertMessage="robinson"  alertIconClass="fa-solid fa-dumpster-fire" >}}

### Neutral: 

Does not pass `alertIconClass`, defaults to info icon.
Does not pass `alertType`, defaults to gray.

{{< alert-wrapper alertTitle="will" alertMessage="robinson" >}}

