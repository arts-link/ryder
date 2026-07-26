import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 5.4: logo.html hardwired grey-box chrome
// (background, hover state, padding) around the logo, whether or not
// logo_png was set. It's now dropped automatically once logo_png is set
// (unless logo_wrapperClass overrides it explicitly). exampleSite's
// docs/logo-configuration page sets logo_png in its own front matter to
// demonstrate this; every other page keeps the default boxed text mark.

test('the default text-mark logo keeps its wrapper chrome', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const wrapper = page.locator('a[href$="/ryder/"] > div').first()
  await expect(wrapper).toHaveClass(/bg-neutral-200/)
})

test('a page-overridden logo_png drops the wrapper chrome', async ({ page }) => {
  await page.goto(`${BASE}/docs/logo-configuration/`)
  const wrapper = page.locator('a[href$="/ryder/"] > div').first()
  await expect(wrapper).not.toHaveClass(/bg-neutral-200/)
  await expect(wrapper.locator('img[src*="apple-touch-icon"]')).toBeVisible()
})
