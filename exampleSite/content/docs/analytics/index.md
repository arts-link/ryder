+++
title = "Analytics"
date = 2026-03-26T10:00:00-07:00
homeFeature = true
homeFeatureTitle = "Analytics"
homeFeatureIcon = "fa-solid fa-chart-line"
categories = ["home-page"]
tags = ["analytics", "plausible", "posthog", "privacy"]
[menu]
 [menu.main]
  weight = 36
  parent = 'docs'
+++

Ryder supports pluggable analytics providers in production. Configure the provider in your site params and the theme will load the matching partial.

<!--more-->

## Choose a provider

```toml
[params]
  analytics_provider = "plausible" # or "posthog"
```

If `analytics_provider` is unset, Ryder emits no analytics script.

## Plausible

Plausible support is unchanged and stays parameter-driven:

```toml
[params]
  analytics_provider = "plausible"
  plausible_domain = "yourdomain.com"
  plausible_advanced = true
```

Advanced mode keeps the outbound-links script and 404 event behavior already built into the theme.

## PostHog

PostHog is intended for sites that want a richer event/session product while keeping the integration in the theme.

```toml
[params]
  analytics_provider = "posthog"
  posthog_host = "https://t.example.com"
  posthog_ui_host = "https://us.posthog.com"
  posthog_defaults = "2026-01-30"
  posthog_person_profiles = "identified_only"
```

The PostHog partial also supports environment variables:

- `PUBLIC_POSTHOG_KEY`
- `PUBLIC_POSTHOG_HOST`
- `PUBLIC_POSTHOG_UI_HOST`

Params take precedence over environment variables.

## Content Security Policy

Ryder's CSP partial automatically adds the right `script-src` and `connect-src` entries for the active analytics provider. If your site uses Hugo's `getenv` in templates, make sure your Hugo security config allows the environment variable names you plan to read.
