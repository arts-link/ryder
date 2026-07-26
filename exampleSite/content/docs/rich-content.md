+++
title = "Media Embeds"
date = "2024-06-01T10:00:00-07:00"
description = "Embed YouTube, Vimeo, and SoundCloud using built-in and theme shortcodes"
homeFeatureIcon = "fa-solid fa-music"
categories = ["home-page"]
tags = ["shortcodes", "video", "embeds"]
showTOC = true
hideAsideBar = true
[menu]
 [menu.main]
  weight = 100
  parent = 'docs'
+++

Embed YouTube, Vimeo, and SoundCloud with shortcodes. Video and iframe embeds require one CSP config line — SoundCloud loads via Hugo's asset pipeline and needs no extra config.

<!--more-->

## CSP setup for video embeds

Iframes from external domains are blocked by the theme's Content Security Policy by default. The `soundcloud`, `openstreetmap`, `youtube-embed`, and `spotify-embed` shortcodes register their own host automatically, but Hugo's built-in `youtube` and `vimeo` shortcodes have no such hook — allow their hosts with the `embeds` preset under `[params.csp]` in `hugo.toml`:

```toml
[params.csp]
  embeds = ["youtube", "vimeo", "soundcloud", "umap"]
```

`embeds` accepts any of `youtube`, `vimeo`, `soundcloud`, `spotify`, `umap` and maps each to its known host(s). Use `frameSrc` instead (or as well) for hosts the preset doesn't cover. Without one of these, the embed renders in the HTML but the browser silently refuses to load it.

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

### `youtube-embed` — the theme's own shortcode

Ryder also ships its own `youtube-embed` shortcode, named distinctly rather
than overriding Hugo's built-in one (so the built-in keeps working exactly as
above). The difference: `youtube-embed` registers its host on `.Page.Store`
the same way `soundcloud` and `openstreetmap` do, so it needs **no**
`embeds` config at all.

{{< highlight go-html-template >}}
{{</* youtube-embed id="VLvVNMbQIRY" */>}}
{{< /highlight >}}

{{< youtube-embed id="VLvVNMbQIRY" >}}

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

## Spotify

The `spotify-embed` shortcode covers tracks, albums, playlists, artists,
episodes, and shows, and registers `open.spotify.com` on `.Page.Store`
automatically — no `embeds` config needed for it specifically (the
`spotify` preset is still there for a hand-written iframe).

{{< highlight go-html-template >}}
{{</* spotify-embed type="track" id="4uLU6hMCjMI75M1A2tKUQC" */>}}
{{< /highlight >}}

{{< spotify-embed type="track" id="4uLU6hMCjMI75M1A2tKUQC" >}}

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `id` | — | Spotify ID for the given type (required); also accepted positionally |
| `type` | `track` | `track`, `album`, `playlist`, `artist`, `episode`, or `show` |
| `height` | `152` (track/episode) or `352` (others) | Iframe height in px |
