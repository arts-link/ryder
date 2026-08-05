import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// The footer's taxonomy groups list individual terms, but the group heading
// ("Top Tags", "Categories") was plain text — the one place in the footer that
// named a taxonomy without offering a way to reach it. It now links to that
// taxonomy's root page.
//
// The heading resolves its href through site.GetPage rather than string
// concatenation, so these assertions care about two things: that the link
// exists and points somewhere Hugo actually built, and that it reads as a link
// before you hover it.

test('footer taxonomy headings link to their taxonomy root page', async ({ page }) => {
  await page.goto(`${BASE}/`)

  const headings = page.locator('.footer-section-title .footer-section-title-link')
  expect(await headings.count()).toBeGreaterThan(0)

  // exampleSite configures tags and categories under [params.footer.taxonomies].
  const tags = page.locator('.footer-section-title-link', { hasText: 'Top Tags' })
  await expect(tags).toHaveAttribute('href', `${BASE}/tags/`)

  const categories = page.locator('.footer-section-title-link', { hasText: 'Categories' })
  await expect(categories).toHaveAttribute('href', `${BASE}/categories/`)
})

test('the heading link actually resolves', async ({ page }) => {
  // A heading that looks like a link and 404s is worse than plain text, and a
  // hand-built href would do exactly that if a site renamed the taxonomy path.
  await page.goto(`${BASE}/`)
  await page.locator('.footer-section-title-link', { hasText: 'Top Tags' }).click()

  await expect(page).toHaveURL(new RegExp(`${BASE}/tags/$`))
  await expect(page.locator('.tagcloud-item').first()).toBeVisible()
})

test('the heading is visibly a link at rest, not only on hover', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const link = page.locator('.footer-section-title-link', { hasText: 'Top Tags' })

  // The footer's usual idiom is underline-on-hover, which is fine for something
  // already shaped like a link. A heading needs the affordance up front.
  await expect(link).toHaveCSS('text-decoration-line', 'underline')
  await expect(link).toHaveCSS('text-decoration-style', 'dotted')
})
