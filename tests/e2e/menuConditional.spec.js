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
//      matter, with the menu entry left ungated. A vanishing "Showcase" link looks
//      like the feature was removed; the truth is "nothing listed yet".
//      exampleSite has no data/showcase.json, so the entry stays and the page says so.

test('a menu entry gated on non-empty data renders', async ({ page }) => {
  await page.goto(`${BASE}/`)
  // Structural locator, not getByRole: these entries live in the Docs
  // submenu, which is aria-hidden while collapsed, so the accessibility tree
  // does not expose them until it is opened.
  await expect(
    page.locator('#nav-menu a[href$="/docs/releases/"]')
  ).toHaveCount(1)
})

test('the gated section itself renders via list-plain, sourced from data', async ({ page }) => {
  await page.goto(`${BASE}/docs/releases/`)
  await expect(page.locator('main h1')).toHaveText('Releases')
  await expect(page.locator('main')).toContainText('v0.3.0')
  // list-plain has no pagination controls
  await expect(page.locator('main .pagination')).toHaveCount(0)
})

test('an ungated section keeps its nav entry even with no data', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(
    page.locator('#nav-menu a[href$="/docs/showcase/"]')
  ).toHaveCount(1)
})

test('an ungated empty section renders emptyDataMessage instead of nothing', async ({ page }) => {
  await page.goto(`${BASE}/docs/showcase/`)
  await expect(page.locator('main h1')).toHaveText('Showcase')
  await expect(page.locator('main .ryder-empty-data')).toHaveText(
    'No sites listed yet — open a PR to add yours.'
  )
})

test('emptyDataMessage does not render when the data has items', async ({ page }) => {
  await page.goto(`${BASE}/docs/releases/`)
  await expect(page.locator('main .ryder-empty-data')).toHaveCount(0)
})

// Negative coverage: exampleSite declares a "Never Rendered" entry gated on
// data/nonexistent.json. An assertion that a gated entry SHOWS when its data
// exists does not prove the gate ever hides anything — this one does.
test('a menu entry gated on missing data does not render at all', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page.locator('#nav-menu')).not.toContainText('Never Rendered')
})
