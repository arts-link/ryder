import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 5.3: utils/socialslist.html used to accept
// only the {main:[{title,icon,link,weight}]} shape. exampleSite's
// data/social.json now mixes structured entries (github/email/feed, which
// keep explicit Font Awesome icons) with entries that omit `icon` entirely
// (instagram/tiktok/apple-music/tidal/spotify), which must resolve to the
// theme's shipped inline SVGs instead of rendering nothing.

test('structured entries with an explicit icon still render their Font Awesome icon', async ({ page }) => {
  await page.goto(`${BASE}/`)
  // main.js's dom.watch() replaces the <i class="fab fa-github"> with an
  // <svg> at runtime; Font Awesome tags its own replacements with
  // svg-inline--fa, which distinguishes them from this theme's own inline
  // SVGs (plain <svg>, no such class) checked below.
  const github = page.locator('.footer-socials-list a[aria-label="GitHub"]')
  await expect(github.locator('svg.svg-inline--fa[data-icon="github"]')).toBeAttached()
})

test('entries with no icon field render an inline SVG instead of nothing', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const instagram = page.locator('.footer-socials-list a[aria-label="Instagram"]')
  await expect(instagram).toBeVisible()
  await expect(instagram.locator('svg:not(.svg-inline--fa)')).toBeAttached()

  const spotify = page.locator('.footer-socials-list a[aria-label="Spotify"]')
  await expect(spotify.locator('svg:not(.svg-inline--fa)')).toBeAttached()
})
