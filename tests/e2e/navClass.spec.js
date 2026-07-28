import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 2.5: header.html resolves a page-overridable
// navClass (or twClasses.nav) and passes it into the menu partial, so a
// single page can restyle just the <nav> without forking header.html into a
// new headerType variant. exampleSite's /docs/custom-navclass/ page sets navClass in front
// matter; every other page keeps the default main-menu-nav.

test('a page with navClass front matter gets the custom nav class', async ({ page }) => {
  await page.goto(`${BASE}/docs/custom-navclass/`)
  const nav = page.locator('#nav-menu nav')
  await expect(nav).toHaveClass(/main-menu-nav/)
  await expect(nav).toHaveClass(/bg-fuchsia-900\/40/)
})

test('a page without navClass keeps the default nav class only', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const nav = page.locator('#nav-menu nav')
  await expect(nav).toHaveClass('main-menu-nav')
})
