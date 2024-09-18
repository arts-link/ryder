+++
title = 'Leaflet Maps'
date = 2024-05-10T14:29:11-07:00
homeFeature = true
homeFeatureWide = true
homeFeatureIcon = "fa-solid fa-map-location-dot"
categories = ["maps"]
tags = ["sample","test","maps"]
hideAsideBar = true
# draft = true 
[menu]
 [menu.main]
  weight = 2
  parent = 'posts'
+++

## Maps on a Hugo website made easy!

{{< lat-long-box 
  latitude="39.9057" 
  longitude="-75.1665"
>}}

Adding a map to your hugo website becomes easy with the `leaflet` shortcode. You can add a box to display the lat and long as well through the use of the `lat-long-box` shortcode.

{{< leaflet id="bankit" lat="39.9057" lon="-75.1665" zoom="16.5" markerLat="39.9057" markerLon="-75.1665" markerPopup="Life at the Bank!" divHeight="450px" >}} 

<!--more-->

## Leaflet Shortcode

{{< highlight go-html-template >}}
{{</* leaflet 
  id="map1" 
  lat="33.966613" 
  lon="-118.426178" 
  zoom="13.5" 
  markerLat="33.9716" 
  markerLon="-118.4363" 
  markerPopup="Green Space right by LAX!" 
*/>}}
{{< /highlight >}}

## Lat-Long Box Shortcode 

Add this shortcode to include the lat-long display box with minutes and seconds.

{{< highlight go-html-template >}}
{{</* lat-long-box 
  latitude="39.9057" 
  longitude="-75.1665"
*/>}}
{{< /highlight >}}