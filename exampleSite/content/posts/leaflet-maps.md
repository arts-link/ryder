+++
title = 'Leaflet Maps'
date = 2024-05-10T14:29:11-07:00
homeFeature = true
homeFeatureIcon = "fa-solid fa-map-location-dot"
categories = ["maps"]
tags = ["maps"]
# draft = true 
[menu]
 [menu.main]
  weight = 2
  parent = 'posts'
+++

You can add a leaflet map to your website through the use of the `leaflet` shortcode.

{{< leaflet id="bankit" lat="39.9057" lon="-75.1665" zoom="16.5" markerLat="39.9057" markerLon="-75.1665" markerPopup="Life at the Bank!" divHeight="450px" >}} 

<!--more-->

{{< highlight go-html-template >}}
{{</* leaflet id="map1" lat="33.966613" lon="-118.426178" zoom="13.5" markerLat="33.9716" markerLon="-118.4363" markerPopup="Green Space right by LAX!" */>}}
{{< /highlight >}}

