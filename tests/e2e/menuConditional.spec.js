import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 2.4 and its counterpart.
//
// An empty data-driven section has two valid behaviors, and which one is right
// depends on what "empty" means to a visitor:
//
//   1. DISAPPEAR — hideIfEmptyData under [menus.<id>.params]. A nav entry with
//      nothing behind it is a dead link. exampleSite gates "Releases" this way;
//      data/releases.json has items, so it renders.
//
//   2. STAY AND EXPLAIN — dataSource + emptyDataMessage in the section's front
//      matter, with the menu entry left ungated. A vanishing "Merch" link looks
//      like the shop was removed; the truth is "nothing for sale yet".
//      exampleSite has no data/merch.json, so the entry stays and the page says so.

test('a menu entry gated on non-empty data renders', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(
    page.locator('#nav-menu').getByRole('link', { name: 'Releases' })
  ).toBeAttached()
})

test('the gated section itself renders via list-plain, sourced from data', async ({ page }) => {
  await page.goto(`${BASE}/releases/`)
  await expect(page.locator('main h1')).toHaveText('Releases')
  await expect(page.locator('main')).toContainText('v0.3.0')
  // list-plain has no pagination controls
  await expect(page.locator('main .pagination')).toHaveCount(0)
})

test('an ungated section keeps its nav entry even with no data', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(
    page.locator('#nav-menu').getByRole('link', { name: 'Merch' })
  ).toBeAttached()
})

test('an ungated empty section renders emptyDataMessage instead of nothing', async ({ page }) => {
  await page.goto(`${BASE}/merch/`)
  await expect(page.locator('main h1')).toHaveText('Merch')
  await expect(page.locator('main .ryder-empty-data')).toHaveText(
    'Nothing for sale yet — check back soon.'
  )
})

test('emptyDataMessage does not render when the data has items', async ({ page }) => {
  await page.goto(`${BASE}/releases/`)
  await expect(page.locator('main .ryder-empty-data')).toHaveCount(0)
})
