import { test, expect } from '@playwright/test'

const BASE = '/ryder'

test('homepage loads with visible content', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page).toHaveTitle(/Ryder/)
  await expect(page.locator('main')).toBeVisible()
})

test('homepage shows featured grid', async ({ page }) => {
  await page.goto(`${BASE}/`)
  // At least one card link in the featured section
  await expect(page.locator('main a[href]').first()).toBeVisible()
})

test('posts list renders articles', async ({ page }) => {
  await page.goto(`${BASE}/posts/`)
  await expect(page.locator('article, [class*="card"]').first()).toBeVisible()
})

test('single post renders body content', async ({ page }) => {
  await page.goto(`${BASE}/posts/leaflet-maps/`)
  await expect(page.locator('h1, h2').first()).toBeVisible()
  await expect(page.locator('main')).toContainText(/map/i)
})

test('leaflet map page has a map container', async ({ page }) => {
  await page.goto(`${BASE}/posts/leaflet-maps/`)
  // Leaflet renders into a div with class leaflet-container
  await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 8000 })
})

test('peaceful page loads with logo', async ({ page }) => {
  await page.goto(`${BASE}/peaceful/`)
  await expect(page.locator('body')).toBeVisible()
  // The hidden-home layout renders the logo partial
  await expect(page.locator('[class*="logo"], #logo, a[href*="ryder"]').first()).toBeVisible()
})

test('category page renders content', async ({ page }) => {
  await page.goto(`${BASE}/categories/maps/`)
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1, h2').first()).toBeVisible()
})

test('tags index page renders', async ({ page }) => {
  await page.goto(`${BASE}/tags/`)
  await expect(page.locator('main')).toBeVisible()
})
