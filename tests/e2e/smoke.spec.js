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

test('docs list renders articles', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  await expect(page.locator('.article').first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Maintenance Page/i }).first()).toBeVisible()
})

test('single post renders body content', async ({ page }) => {
  await page.goto(`${BASE}/docs/leaflet-maps/`)
  await expect(page.locator('h1, h2').first()).toBeVisible()
  await expect(page.locator('main')).toContainText(/map/i)
})

test('leaflet map page has a map container', async ({ page }) => {
  await page.goto(`${BASE}/docs/leaflet-maps/`)
  // Leaflet renders into a div with class leaflet-container
  await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 8000 })
})

test('maintenance page loads with logo', async ({ page }) => {
  await page.goto(`${BASE}/maintenance-page/`)
  await expect(page.locator('body')).toBeVisible()
  // The hidden-home layout renders the logo partial
  await expect(page.locator('[class*="logo"], #logo, a[href*="ryder"]').first()).toBeVisible()
})

test('ryder gallery page renders gallery images', async ({ page }) => {
  await page.goto(`${BASE}/ryder-gallery/`)
  await expect(page.locator('#gallery img').first()).toBeVisible()
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

test('mobile docs submenu opens as a compact popout', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'mobile viewport check uses chromium device metrics')

  await page.setViewportSize({ width: 414, height: 846 })
  await page.goto(`${BASE}/`)

  await page.getByRole('button', { name: /toggle menu/i }).click()

  const navMenu = page.locator('#nav-menu')
  const docsToggle = navMenu.getByRole('button', { name: /Docs/i }).first()
  const docsItem = docsToggle.locator('xpath=ancestor::li[1]')
  const submenu = docsItem.locator('.child-ul-container')

  const navBoxBefore = await navMenu.boundingBox()
  await docsToggle.click()

  await expect(submenu).toBeVisible()
  await expect(submenu.getByRole('link', { name: /Maintenance Page/i })).toBeVisible()

  const navBoxAfter = await navMenu.boundingBox()
  const submenuBox = await submenu.boundingBox()

  expect(navBoxBefore).not.toBeNull()
  expect(navBoxAfter).not.toBeNull()
  expect(submenuBox).not.toBeNull()

  expect(Math.abs(navBoxAfter.height - navBoxBefore.height)).toBeLessThan(24)
  expect(submenuBox.x).toBeGreaterThanOrEqual(0)
  expect(submenuBox.x + submenuBox.width).toBeLessThanOrEqual(430)

  await submenu.getByRole('link', { name: /Maintenance Page/i }).click()
  await expect(page).toHaveURL(/\/docs\/maintenance-page\//)
})
