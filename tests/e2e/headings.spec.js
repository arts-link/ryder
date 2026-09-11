import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Until v0.5.0 the wordmark in partials/logo.html was an <h1>, and header.html
// renders it on every page — so every page with its own title shipped TWO
// <h1>s, and the home page's only <h1> was the site name rather than anything
// about the page.
//
// logo.html is now a <span> carrying the classes the h1 base rule used to
// supply (see the comment in that file — they are load-bearing), and the page's
// real heading is the only <h1> left.

/** Text of every <h1> on the page, in document order. */
const headings = (page) => page.locator('h1').allTextContents()

test('a single page has exactly one <h1>, and it is the article title', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  const h1s = await headings(page)
  expect(h1s).toHaveLength(1)
  expect(h1s[0]).toContain('Alerts')
})

test('a section list has exactly one <h1>', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  expect(await headings(page)).toHaveLength(1)
})

// The home page was the worst case: its only <h1> was the site name, and the
// page's own title rendered as an <h2> gated behind showHomeTitle.
test('the home page has exactly one <h1>, and it is the page title', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const h1s = await headings(page)
  expect(h1s).toHaveLength(1)
  expect(h1s[0]).toContain('The Ryder Theme')
})

// Scoped to the logo partial's own wrapper, not `header h1` — single.html wraps
// the article title in <header class="article-header">, so a bare `header h1`
// matches the page's legitimate heading.
test('the wordmark is not a heading, and keeps the styling the <h1> used to give it', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  const logo = page.locator(`a[href="${BASE}/"]`).first()
  await expect(logo.locator('h1, h2, h3, h4, h5, h6')).toHaveCount(0)

  // The classes below are the point of the change: main.css's `@layer base`
  // h1 rule supplied font-bold, tracking-tight and block display, all of which
  // a bare tag swap would have silently dropped.
  const mark = logo.locator('span.text-4xl').first()
  await expect(mark).toHaveClass(/block/)
  await expect(mark).toHaveClass(/font-bold/)
  await expect(mark).toHaveClass(/tracking-tight/)
  expect(await mark.evaluate((el) => el.tagName)).toBe('SPAN')

  // Computed, not just declared — this is what protects the rendered wordmark.
  const styles = await mark.evaluate((el) => {
    const cs = getComputedStyle(el)
    return { size: cs.fontSize, weight: cs.fontWeight, display: cs.display }
  })
  expect(styles.size).toBe('36px') // text-4xl
  expect(styles.weight).toBe('700') // font-bold
  expect(styles.display).toBe('block')
})

// logo.html's two letter loops open a collapsible <span> after the first letter
// and never closed it — the close conditions could not fire for a normal-length
// word. The <h1> hid that: the browser force-closed every dangling span at
// </h1>, so the tagline underneath stayed a sibling. Under a <span> wrapper the
// still-open brand span swallowed it, and the tagline rendered BESIDE the
// wordmark instead of beneath it. Structure, because the visual symptom is one
// unclosed tag away at all times.
test('the tagline is a sibling of the wordmark, not nested inside it', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const logo = page.locator(`a[href="${BASE}/"]`).first()
  const tagline = logo.getByText('FOR HUGO WEBSITES')
  await expect(tagline).toHaveCount(1)

  const nestedInWordmark = await tagline.evaluate((el) =>
    Boolean(el.closest('span.text-4xl')),
  )
  expect(nestedInWordmark).toBe(false)

  // Stacked by the flex-col parent, not sitting beside it. Compared against the
  // wordmark's midpoint rather than its bottom edge: the tagline carries
  // mt-[-0.25em], so it deliberately overlaps the line box below it.
  const mark = await logo.locator('span.text-4xl').first().boundingBox()
  const tag = await tagline.boundingBox()
  expect(tag.y).toBeGreaterThan(mark.y + mark.height / 2)
})

// hidden-home/baseof.html calls logo.html directly rather than through
// header.html and has no other heading, so the wordmark's <h1> was that
// layout's only one. It gets a visually-hidden heading instead.
test('the hidden-home layout keeps a heading, visually hidden', async ({ page }) => {
  await page.goto(`${BASE}/maintenance-page/`)
  const h1 = page.locator('h1')
  await expect(h1).toHaveCount(1)
  await expect(h1).toHaveText('Maintenance Page')
  await expect(h1).toHaveClass(/sr-only/)
  await expect(h1).not.toBeInViewport()
})
