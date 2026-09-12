import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// v0.5.0 changed what the breadcrumb renders, for every consuming site.
//
// The trail is Home plus the page's ancestors, and it renders only when the page
// has a parent that isn't home. It no longer ends in a link to the current page:
// that crumb sat directly above the <h1> saying the same words, so it was a
// duplicated heading and a link to nowhere rather than navigation. On a
// top-level page the whole thing used to collapse to `Home »` plus that
// self-link.
//
// These assertions read the rendered HTML rather than the template, because the
// depth rule lives in two places — partials/breadcrumb.html and the wrapper
// guard in _default/baseof.html — and only the output proves both agree.

const crumbNav = (page) => page.locator('nav[aria-label="breadcrumb"]')

test('a top-level page renders no trail at all', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  await expect(crumbNav(page)).toHaveCount(0)
})

// baseof.html wraps the partial in a max-w-screen-lg div. Without a matching
// guard on the wrapper the nav disappears but an empty div still ships, so
// assert on what surrounds the nav, not only the nav.
test('the wrapper div does not ship empty on a top-level page', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  const strays = await page.locator('main > div.max-w-screen-lg:empty').count()
  expect(strays).toBe(0)
})

test('a depth-2 page renders Home then its section, both linked', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  const links = crumbNav(page).locator('a')
  await expect(links).toHaveCount(2)
  await expect(links).toHaveText(['Home', 'Docs'])
  await expect(links.nth(0)).toHaveAttribute('href', `${BASE}/`)
  await expect(links.nth(1)).toHaveAttribute('href', `${BASE}/docs/`)
})

test('a depth-3 page renders its full trail in order', async ({ page }) => {
  await page.goto(`${BASE}/docs/breadcrumbs/three-levels-deep/`)
  await expect(crumbNav(page).locator('a')).toHaveText(['Home', 'Docs', 'Breadcrumbs'])
})

// The trail stops at the parent. The page's own name is the <h1> below it.
test('the trail never links to the page it is on', async ({ page }) => {
  await page.goto(`${BASE}/docs/breadcrumbs/three-levels-deep/`)
  await expect(crumbNav(page).locator('[aria-current]')).toHaveCount(0)
  const hrefs = await crumbNav(page).locator('a').evaluateAll((els) => els.map((e) => e.getAttribute('href')))
  expect(hrefs).not.toContain(`${BASE}/docs/breadcrumbs/three-levels-deep/`)
})

// An ordered sequence, and the markup says so — it also matches the
// BreadcrumbList semantics of the JSON-LD emitted alongside it.
test('the trail is an ordered list', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  await expect(crumbNav(page).locator('ol')).toHaveCount(1)
  await expect(crumbNav(page).locator('ul')).toHaveCount(0)
})

// The » used to live INSIDE each <a>, which put it in every link's accessible
// name — screen readers read "Home angles right". It is now a sibling of the
// link and hidden from the accessibility tree.
//
// Matched by class rather than tag: Font Awesome's JS replaces the authored
// <i> with an <svg> at runtime, so the rendered DOM has no <i> to find.
test('the separator is outside the link and hidden from assistive tech', async ({ page }) => {
  await page.goto(`${BASE}/docs/breadcrumbs/three-levels-deep/`)
  await expect(crumbNav(page).locator('a .fa-angles-right')).toHaveCount(0)

  const seps = crumbNav(page).locator('.fa-angles-right')
  await expect(seps).toHaveCount(2) // one leading each ancestor, none trailing
  for (const sep of await seps.all()) {
    await expect(sep).toHaveAttribute('aria-hidden', 'true')
  }
})

// docs/breadcrumbs/no-trail/ is a sibling of three-levels-deep/ at identical
// depth, differing only by showBreadCrumbs = false — so the pair isolates the
// flag from the depth rule.
test('showBreadCrumbs = false suppresses the trail its sibling renders', async ({ page }) => {
  await page.goto(`${BASE}/docs/breadcrumbs/three-levels-deep/`)
  await expect(crumbNav(page)).toHaveCount(1)

  await page.goto(`${BASE}/docs/breadcrumbs/no-trail/`)
  await expect(crumbNav(page)).toHaveCount(0)
})

// The flag has to do both halves. Structured data used to be gated only on
// `not .IsHome`, so a page with the trail switched off still claimed one.
test('showBreadCrumbs = false also suppresses the BreadcrumbList', async ({ page }) => {
  await page.goto(`${BASE}/docs/breadcrumbs/no-trail/`)
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types = raw.map((t) => JSON.parse(t)['@type'])
  expect(types).toContain('BlogPosting')
  expect(types).not.toContain('BreadcrumbList')
})
