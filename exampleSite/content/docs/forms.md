+++
title = "Forms"
date = 2026-03-26T11:00:00-07:00
categories = ["home-page"]
tags = ["forms", "alpine", "csp"]
[menu]
 [menu.main]
  weight = 37
  parent = 'docs'
+++

Ryder ships `ryderForm`, a declarative Alpine component that POSTs a form as
JSON, so you don't have to write a submit handler that CSP-Alpine cannot run.

<!--more-->

## Why not just write the handler inline?

The theme bundles `@alpinejs/csp`. Its expression evaluator only does plain
property lookups — it **cannot** evaluate function calls, member calls, or arrow
functions in an inline directive, and it **does not throw** when it meets one.
An inline `@submit="fetch(...)"` renders fine, logs nothing, and never runs.

So every value the handler needs travels as a `data-` attribute, and the handler
itself is a named method on a registered component.

## Usage

```html
<form x-data="ryderForm" @submit.prevent="submit"
      data-form-action="https://api.example.com/subscribe"
      data-track-event="signup_submit">
  <input type="email" name="email" required>

  <!-- honeypot: bots fill it, humans never see it -->
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         class="hidden" aria-hidden="true">

  <button type="submit" :disabled="isLoading">Subscribe</button>

  <p x-show="isSuccess">Thanks!</p>
  <p x-show="isError" x-text="errorMessage"></p>
</form>
```

Every named field is serialized into a JSON object and POSTed to
`data-form-action` with `Content-Type: application/json`.

### State

`status` is the raw string: `''`, `'loading'`, `'success'`, or `'error'`.

Because the CSP evaluator cannot evaluate a comparison like
`status === 'success'`, the component also exposes plain booleans — use these in
`x-show` and `:disabled`:

| Property | True when |
|---|---|
| `isIdle` | nothing submitted yet |
| `isLoading` | request in flight |
| `isSuccess` | request succeeded |
| `isError` | request failed, or `data-form-action` is missing |

`errorMessage` carries the message shown on failure. Override the default with
`data-error-message` on the `<form>`.

### Honeypot

A field named `_gotcha` is treated as a spam trap. If it has a value, the
component reports success and sends nothing — the bot gets no signal that it was
caught. `_gotcha` is never included in the JSON payload.

### Tracking

Add `data-track-event` (and optionally `data-track-props`) to the `<form>` and it
fires through the same provider path as [`ryderTrack`](../analytics/) once the
POST succeeds — never on failure.

## Content Security Policy

`fetch` to another origin is blocked unless the action's host is in
`connect-src`. Add it:

```toml
[params.csp]
  connectSrc = "https://api.example.com"
```

Same-origin actions need nothing — `connect-src 'self'` is always present.

## Live demo

This demo posts to a same-origin path that does not exist on the example site,
so it deliberately lands in the error state. That is what a failed submit looks
like:

{{< pass >}}
<form id="ryder-form-demo" x-data="ryderForm" @submit.prevent="submit"
      data-form-action="/ryder/api/demo-subscribe"
      data-error-message="No backend on the demo site — this is the error state."
      class="my-4 flex flex-col gap-3">
  <input type="email" name="email" required placeholder="you@example.com"
         class="border rounded px-3 py-2 text-neutral-900 max-w-sm">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         class="hidden" aria-hidden="true">
  <button type="submit" :disabled="isLoading"
          class="bg-slate-800 text-neutral-100 font-medium py-2 px-4 rounded-full border-2 border-fuchsia-600 max-w-fit dark:bg-slate-700">
    Subscribe
  </button>
  <p id="ryder-form-demo-loading" x-show="isLoading" x-cloak>Sending…</p>
  <p id="ryder-form-demo-success" x-show="isSuccess" x-cloak>Thanks!</p>
  <p id="ryder-form-demo-error" x-show="isError" x-cloak x-text="errorMessage"></p>
</form>
{{< /pass >}}
