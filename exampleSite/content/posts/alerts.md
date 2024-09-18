+++
title = 'Alerts'
date = 2024-01-26T12:55:50-08:00
# draft = true
homeFeatureTitle = "Alert boxes"
homeFeatureIcon = "fa-solid fa-dungeon"
tags = ["sample","test","alerts","banners"]

[menu]
 [menu.main]
  weight = 1
  parent = 'posts'

+++

## Create alerts as shortcode or partial or in hugo.toml for global announcements.

{{< alert-wrapper alertType="info" alertTitle="Make it known" alertMessage="Alerts are fun to use for all!" dismissable=true >}}

<!--more-->

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
  dismissable = true
```
## Features:
- **Alert Types**: Supports info, danger, success, warning, and a default dark type.
- `info` (blue), `success` (green), `warning` (yellow), `danger` (red), `dark` (dark)  
- **Icon Classes**: Automatically assigns default icons based on the alert type but allows for custom icons if specified.
- **Conditional Display**: Only displays the alert box if there is either a title or a message.
- **Default Values**: Provides default values to avoid issues when variables are not set.
- **Dismissable**: Defaults to false, add true and it will have an x to close the alert box.

For `alertIconClass` any [fontawesome-free icon class](https://fontawesome.com/search?o=r&m=free) will work.

__**TODO**__:: Make dismissable sticky with a cookie or local storage.
## From the content directory, called as a shortcode.

All of the params are optional, but if neither alertTitle or alertMessage are passed they will not render. The `alertIconClass` must be a valid [fontawesome icon class](https://fontawesome.com/search?o=r&m=free).

```go
{{</* alert-wrapper 
  alertType="info" 
  alertTitle="will" 
  alertMessage="robinson" 
  alertIconClass="fa-solid fa-snowflake"
  dismissable=true
*/>}}
```

## Alert shortcode examples:
  
### Info: 

Uses `fa-solid fa-snowflake`. This one is dismissable.

{{< alert-wrapper alertType="info" alertTitle="will" alertMessage="robinson <a href='#info'>test</a>" alertIconClass="fa-solid fa-snowflake" dismissable="true">}}  

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

