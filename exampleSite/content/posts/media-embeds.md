+++
title = 'Media Embeds'
date = 2024-06-01T10:00:00-07:00
homeFeatureIcon = "fa-solid fa-music"
categories = ["home-page"]
tags = ["sample"]
hideAsideBar = true
+++

## SoundCloud

Embed a SoundCloud track with the `soundcloud` shortcode. Pass the API resource URL for the track.

{{< highlight go-html-template >}}
{{</* soundcloud url="https://api.soundcloud.com/tracks/1120047793" */>}}
{{< /highlight >}}

<!--more-->

The shortcode accepts these optional parameters:

| Parameter | Default | Description |
|---|---|---|
| `url` | — | SoundCloud API resource URL (required) |
| `color` | `#ff5500` | Player accent color (hex) |
| `auto_play` | `false` | Start playing on load |
| `hide_related` | `false` | Hide related tracks |
| `show_comments` | `true` | Show waveform comments |
| `show_user` | `true` | Show uploader attribution |
| `show_reposts` | `false` | Show reposts in sidebar |
| `visual` | `true` | Use visual (large artwork) player |
| `user_id` | — | SoundCloud username, for attribution link |
| `user_name` | — | Display name for attribution |
| `track_title` | — | Track title for attribution link |

To find a track's API URL: open SoundCloud in a browser, view page source, and search for `"api.soundcloud.com/tracks/`.


### Example

{{< soundcloud
  url="https://api.soundcloud.com/tracks/1120047793"
  show_user="false"
>}}
