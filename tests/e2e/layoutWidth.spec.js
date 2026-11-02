import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// --- Header: the menu button must never push the page wider than the screen.
//
// The wordmark used to be unshrinkable (an &nbsp; between the words, a fixed
// size) and the toggler shrinkable, so on a narrow phone, or one with its
// system font size turned up (Firefox for Android follows it), the toggler was
// shoved past the right edge. The page grew wider than the viewport and mobile
// browsers zoomed out to fit it. Font scale is simulated by raising the root
// font size, which is what a text-size preference amounts to for rem units.

const cases = [
  { width: 320, scale: 1 },
  { width: 360, scale: 1 },
  { width: 412, scale: 1 },
  { width: 412, scale: 1.2 },
  { width: 412, scale: 1.4 },
  { width: 360, scale: 1.4 },
]

for (const { width, scale } of cases) {
  test(`header fits a ${width}px screen at ${scale}x font size`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'uses chromium device metrics')
    await page.setViewportSize({ width, height: 800 })
    await page.goto(`${BASE}/`)
    await page.evaluate((s) => {
      document.documentElement.style.fontSize = `${16 * s}px`
    }, scale)

    // Only the header is asserted: at 1.4x on 360px a long exampleSite card
    // title overflows on its own, which is a separate problem.
    const headerRight = await page.evaluate(() =>
      Math.max(...[...document.querySelector('header').querySelectorAll('*')].map((el) => el.getBoundingClientRect().right)),
    )
    expect(headerRight).toBeLessThanOrEqual(width)

    const toggle = page.getByRole('button', { name: /toggle menu/i })
    const box = await toggle.boundingBox()
    expect(box.x + box.width).toBeLessThanOrEqual(width)

    // And the logo doesn't slide under the button instead: every glyph of the
    // wordmark ends left of it.
    const markRight = await page.locator('header span.logo-wordmark').first().evaluate((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return Math.max(...[...range.getClientRects()].map((r) => r.right))
    })
    expect(markRight).toBeLessThanOrEqual(box.x)
  })
}

test('the wordmark stays on one line on an ordinary phone', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'uses chromium device metrics')
  await page.setViewportSize({ width: 412, height: 800 })
  await page.goto(`${BASE}/`)
  const mark = page.locator('header span.logo-wordmark').first()
  const height = await mark.evaluate((el) => el.getBoundingClientRect().height)
  const lineHeight = await mark.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight))
  expect(height).toBeLessThan(lineHeight * 1.5)
})

// --- hideAsideBar hides the whole aside, tags included (benstrawbridge.com#118).
//
// It used to gate only the TOC, so a tagged page kept the aside column and
// never went full width. Its tags now render below the article instead.

test('hideAsideBar drops the aside and moves tags below the article', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`${BASE}/docs/rich-content/`)

  await expect(page.locator('main aside')).toHaveCount(0)
  const tags = page.locator('.aside-taxonomy-group')
  await expect(tags).toHaveCount(1)
  await expect(tags.locator('.aside-taxonomy-link').first()).toBeVisible()

  const content = page.locator('main .content').first()
  const contentBox = await content.boundingBox()
  const tagsBox = await tags.boundingBox()
  expect(tagsBox.y).toBeGreaterThan(contentBox.y + contentBox.height - 1)
})

test('a tagged page without hideAsideBar keeps its tags aside', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`${BASE}/docs/about-hugo/`)
  await expect(page.locator('main aside .aside-taxonomy-group')).toHaveCount(1)
})

// --- Viewport meta pins the initial zoom (arts-link/ryder#88).

test('viewport meta sets initial-scale=1', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const metas = page.locator('meta[name="viewport"]')
  await expect(metas).toHaveCount(1)
  await expect(metas).toHaveAttribute('content', 'width=device-width, initial-scale=1')
})
