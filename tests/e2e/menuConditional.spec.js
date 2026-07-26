import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 2.4: menu entries can be gated on a
// data/*.json file (shaped {"items": [...]}) having content, via
// hideIfEmptyData under [menus.main.params]. exampleSite configures two
// entries to prove both directions: "Press" (data/press.json has items) and
// "Merch" (data/merch.json does not exist, so its items are empty).

test('a menu entry gated on non-empty data renders', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page.locator('#nav-menu').getByRole('link', { name: 'Press' })).toBeAttached()
})

test('a menu entry gated on empty/missing data does not render', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page.locator('#nav-menu').getByRole('link', { name: 'Merch' })).toHaveCount(0)
})

test('the gated section itself renders via list-plain, sourced from data', async ({ page }) => {
  await page.goto(`${BASE}/press/`)
  await expect(page.locator('main h1')).toHaveText('Press')
  await expect(page.locator('main')).toContainText('Ryder theme review')
  // list-plain has no pagination controls
  await expect(page.locator('main .pagination')).toHaveCount(0)
})
