+++
title = 'Alerts'
date = 2024-01-26T12:55:50-08:00
# draft = true
[menu]
 [menu.main]
  weight = 2
  parent = 'posts'
+++

All of the params are optional, but if neither alertTitle or alertMessage are passed they will not render. The default icon if no `alertIconClass` is passed is info. The `alertIconClass` must be a valid [fontawesome icon class](https://fontawesome.com/search?o=r&m=free), or class defined in your custom css.

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

{{< alert-wrapper alertType="info" alertTitle="will" alertMessage="robinson" alertIconClass="fa-solid fa-snowflake">}}  

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

