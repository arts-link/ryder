import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 5.1: the youtube-embed and spotify-embed
// shortcodes render an iframe pointed at the right host, and — like
// soundcloud/openstreetmap before them — register that host on .Page.Store
// so head/csp.html folds it into frame-src automatically, with no
// params.csp.embeds entry required for these two specifically.

test('youtube-embed renders an iframe to youtube-nocookie.com', async ({ page }) => {
  await page.goto(`${BASE}/docs/rich-content/`)
  const iframe = page.locator('iframe[src*="youtube-nocookie.com/embed/VLvVNMbQIRY"]')
  await expect(iframe).toBeAttached()
})

test('spotify-embed renders an iframe to open.spotify.com', async ({ page }) => {
  await page.goto(`${BASE}/docs/rich-content/`)
  const iframe = page.locator('iframe[src*="open.spotify.com/embed/track/"]')
  await expect(iframe).toBeAttached()
})

test('CSP meta on the embeds page allows both auto-registered hosts', async ({ page }) => {
  await page.goto(`${BASE}/docs/rich-content/`)
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')
  expect(csp).toContain('https://www.youtube-nocookie.com')
  expect(csp).toContain('https://open.spotify.com')
})
