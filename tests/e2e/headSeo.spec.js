import { test, expect } from '@playwright/test'

const BASE = '/ryder'

const metaDescription = (page) => page.locator('meta[name="description"]').getAttribute('content')

// Taxonomy TERM pages have neither a .Description nor a .Summary, so every one
// of them used to fall straight through to the single site-wide description.
// On a real site that measured 1,004 pages sharing one sentence.
//
// params.taxonomyDescription is a table of printf format strings keyed by the
// taxonomy's singular name, rendered with the term title. exampleSite sets one
// for `tag` and one for `category`.

test('a term page gets a description built from its own title', async ({ page }) => {
  await page.goto(`${BASE}/tags/alerts/`)
  expect(await metaDescription(page)).toBe(
    'Every Ryder theme page tagged “Alerts” — docs, demos, and examples.',
  )
})

test('two term pages in the same taxonomy do not share a description', async ({ page }) => {
  await page.goto(`${BASE}/tags/alerts/`)
  const alerts = await metaDescription(page)
  await page.goto(`${BASE}/tags/navigation/`)
  const navigation = await metaDescription(page)
  expect(alerts).not.toBe(navigation)
})

// Each taxonomy reads its own entry, keyed by .Data.Singular — `category` here,
// `tag` above. /categories/recipes/ has no _index.md of its own, so nothing
// shadows the template.
test('each taxonomy uses its own template', async ({ page }) => {
  await page.goto(`${BASE}/categories/recipes/`)
  expect(await metaDescription(page)).toBe('Ryder theme documentation filed under “Recipes”.')
})

// A term page with a real description in its own _index.md still wins — the
// template is a fallback, not an override.
test('a term with its own description keeps it', async ({ page }) => {
  await page.goto(`${BASE}/categories/maps/`)
  const desc = await metaDescription(page)
  expect(desc).not.toContain('filed under')
  expect(desc).toContain('Leaflet')
})

// Term pages only. On /tags/ the singular key is also "tag" but the title is
// "Tags", so a shared template would read "…tagged Tags". Index pages keep the
// site description.
test('a taxonomy index page falls through to the site description', async ({ page }) => {
  await page.goto(`${BASE}/tags/`)
  expect(await metaDescription(page)).toContain('A barebones Hugo theme')
})

// site.Title is often the long legal or marketing name; a 34-character one
// truncated the useful half of nearly every SERP title. params.titleShort is
// the site-wide short form, and per-page sectionTitle still wins over it.
test('the title suffix uses params.titleShort', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  await expect(page).toHaveTitle('Alerts | Ryder')
})

test('the home page title is still the full site title', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await expect(page).toHaveTitle('The Ryder Theme')
})

// The site-wide entity took its name from site.Title, which named a Person
// after the whole site. params.author.name comes first now.
test('the site entity is named from params.author.name', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents()
  const entity = raw.map((t) => JSON.parse(t)).find((b) => b['@type'] === 'Organization')
  expect(entity.name).toBe('Ben Strawbridge')
})
