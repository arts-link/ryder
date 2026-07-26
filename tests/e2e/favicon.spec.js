import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 5.5: head/favicon.html used to pin a single
// hardcoded /favicon.ico?v=4 with no apple-touch-icon or webmanifest link.
// Now configurable via [params.favicon], defaulting to the files the theme
// already ships; exampleSite additionally opts into a webmanifest link.

test('favicon, apple-touch-icon, and webmanifest links are present', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page.locator('link[rel="icon"][type="image/x-icon"]')).toHaveAttribute('href', /favicon\.ico\?v=4/)
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', /favicon\.svg/)
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /apple-touch-icon\.png/)
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', /site\.webmanifest/)
})

// Hugo lower-cases config keys, so `isset $favicon "appleTouchIcon"` never
// matched and the site's value was silently discarded in favour of the
// default. The bug survived the test above because that assertion passes
// whether the value came from config or from the fallback — so this asserts
// the sized-icon array, which has NO default and therefore can only render
// when the params are actually being read.
test('sized PNG icons come from [[params.favicon.icons]]', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const sized = page.locator('link[rel="icon"][type="image/png"][sizes="32x32"]')
  await expect(sized).toHaveCount(1)
  await expect(sized).toHaveAttribute('href', /favicon\.svg/)
})

test('the webmanifest file itself is served and valid JSON', async ({ request }) => {
  const response = await request.get(`${BASE}/site.webmanifest`)
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.name).toBeTruthy()
})
