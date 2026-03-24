+++
title = "Media Embeds"
date = "2024-06-01T10:00:00-07:00"
description = "Embed YouTube, Vimeo, SoundCloud, and Twitter using built-in and theme shortcodes"
homeFeatureIcon = "fa-solid fa-music"
categories = ["home-page"]
tags = ["shortcodes", "video", "embeds"]
showTOC = true
hideAsideBar = true
[menu]
 [menu.main]
  weight = 100
  parent = 'posts'
+++

Embed YouTube, Vimeo, SoundCloud, and Twitter with shortcodes. Video and iframe embeds require one CSP config line — SoundCloud loads via Hugo's asset pipeline and needs no extra config.

<!--more-->

## CSP setup for video embeds

Iframes from external domains are blocked by the theme's Content Security Policy by default. Add the domains you need under `[params.csp]` in `hugo.toml`:

```toml
[params.csp]
  frameSrc = "https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://w.soundcloud.com"
```

Without this, the embed renders in the HTML but the browser silently refuses to load it.

---

## YouTube

Hugo's built-in `youtube` shortcode uses `youtube-nocookie.com` by default — no tracking cookies unless the viewer clicks play.

Find the video ID in the URL after `?v=`:

```
https://www.youtube.com/watch?v=VLvVNMbQIRY
                                ^^^^^^^^^^^
```

{{< highlight go-html-template >}}
{{</* youtube VLvVNMbQIRY */>}}
{{< /highlight >}}

{{< youtube VLvVNMbQIRY >}}

---

## Vimeo

{{< highlight go-html-template >}}
{{</* vimeo 48912912 */>}}
{{< /highlight >}}

{{< vimeo 48912912 >}}

---

## SoundCloud

Use the `soundcloud` shortcode with an API resource URL. To find a track's API URL: open SoundCloud in a browser, view page source, and search for `"api.soundcloud.com/tracks/`.

{{< highlight go-html-template >}}
{{</* soundcloud url="https://api.soundcloud.com/tracks/1120047793" */>}}
{{< /highlight >}}

### Parameters

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

{{< soundcloud
  url="https://api.soundcloud.com/tracks/1120047793"
  show_user="false"
>}}

---

## Twitter / X

{{< highlight go-html-template >}}
{{</* x user="DesignReviewed" id="1085870671291310081" */>}}
{{< /highlight >}}
