+++
title = 'Alerts'
date = 2024-01-26T12:55:50-08:00
homeFeature = true
homeFeatureTitle = "Alert boxes"
homeFeatureIcon = "fa-solid fa-dungeon"
tags = ["sample","test","alerts","banners"]

[menu]
 [menu.main]
  weight = 50
  parent = 'docs'

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

### Info

{{< alert-wrapper alertType="info" alertTitle="New feature available" alertMessage="Dark mode is now supported. Toggle it using the sun/moon icon in the header." alertIconClass="fa-solid fa-snowflake" >}}

### Success

{{< alert-wrapper alertType="success" alertTitle="Configuration saved" alertMessage="Your changes have been applied and will take effect on the next build." alertIconClass="fa-solid fa-bicycle" >}}

### Warning

{{< alert-wrapper alertType="warning" alertTitle="Heads up" alertMessage="This page uses the Leaflet shortcode which requires loadLeaflet = true in your front matter." alertIconClass="fa-solid fa-bath" >}}

### Danger

{{< alert-wrapper alertType="danger" alertTitle="Breaking change" alertMessage="The headerGradientClasses param has been replaced by twClasses.headerBackgroundFrameOuter. Update your config before upgrading." alertIconClass="fa-solid fa-dumpster-fire" >}}

### Default (no type)

No `alertType` passed — renders with a neutral gray style. No `alertIconClass` either, so the default icon is used.

{{< alert-wrapper alertTitle="Just so you know" alertMessage="This is a neutral alert with no type specified." >}}

## Dismissable alerts

Add `dismissable="true"` to any alert to show a close button. The user can dismiss it and it will not reappear.

{{< highlight go-html-template >}}
{{</* alert-wrapper
  alertType="success"
  alertTitle="All set"
  alertMessage="You can dismiss this alert with the X button."
  dismissable="true"
*/>}}
{{< /highlight >}}

{{< alert-wrapper alertType="success" alertTitle="All set" alertMessage="You can dismiss this alert with the X button." dismissable="true" >}}
