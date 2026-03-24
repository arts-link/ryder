+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = {{ .Date }}
draft = true
categories = ["maps"]
# tags = [""]
hideAsideBar = true
homeFeatureIcon = "fa-solid fa-map-location-dot"
# Enables Leaflet.js — required for {{</* leaflet */>}} and {{</* lat-long-box */>}} shortcodes
loadLeaflet = true

# Coordinates used as fallback by the {{</* lat-long-box */>}} shortcode (no params needed)
[maps]
  lat = 40.71
  lon = -74.00
+++

<!--more-->

{{</* lat-long-box */>}}

{{</* leaflet id="map1" lat="40.71" lon="-74.00" zoom="13" markerPopup="Location" */>}}

<!-- To embed a saved uMap instead, replace the leaflet shortcode above with:
{{</* openstreetmap mapName="your-map-name-123456" */>}}
-->
