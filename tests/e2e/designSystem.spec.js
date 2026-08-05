import { test, expect } from '@playwright/test'

const BASE = '/ryder'
const PAGE = `${BASE}/docs/design-system/`

// The design-system page documents the theme by *rendering* it: every preview is
// a live partial or shortcode call, which is the whole reason the page exists
// rather than a hand-maintained one. That property is invisible in a screenshot
// — a stale hardcoded copy of the markup would look identical — so it is what
// these assertions check. If a preview here stops being live, the page has
// quietly become the thing it was built to replace.

test('swatches paint from the live colour tokens, not baked-in hex', async ({ page }) => {
  await page.goto(PAGE)

  // Selected by class, not by its style attribute: the override below puts
  // --ryder-accent on <html>, which would otherwise match an attribute selector
  // and re-resolve the locator to the document element mid-test.
  //
  // The chip reads rgb(var(--ryder-accent)). Overriding the custom property has
  // to move it; a swatch painted with a literal #f43f5e would not budge, and
  // that is exactly the drift this page is supposed to be immune to.
  const chip = page.locator('.ryder-swatch-chip[data-token="--ryder-accent"]')
  await expect(chip).toHaveCSS('background-color', 'rgb(244, 63, 94)')

  await page.evaluate(() =>
    document.documentElement.style.setProperty('--ryder-accent', '217 70 239'),
  )
  await expect(chip).toHaveCSS('background-color', 'rgb(217, 70, 239)')
})

test('token tables are rendered from the data file, through the real table wrapper', async ({
  page,
}) => {
  await page.goto(PAGE)

  // Both halves matter: the tables exist, and they are wrapped by the same
  // v0.4.0 component the page documents further down rather than by bespoke
  // markup written for this page.
  const tables = page.locator('.ryder-table')
  expect(await tables.count()).toBeGreaterThanOrEqual(6)

  // A value straight out of data/design-system.json.
  await expect(page.locator('.ryder-table', { hasText: '--ryder-brand' }).first()).toContainText(
    '7 89 133',
  )
})

test('the form preview is a real ryderForm, wired to the engine', async ({ page }) => {
  await page.goto(PAGE)

  const form = page.locator('form[x-data="ryderForm"]')
  await expect(form).toHaveCount(1)

  // Rendered by utils/form-field.html — the label/control pairing and the focus
  // token are the partial's, not this page's.
  await expect(form.locator('label[for="email"]')).toBeVisible()
  await expect(form.locator('#email')).toHaveClass(/outline-ryder-brand/)
  await expect(form.locator('textarea#message')).toBeVisible()
  await expect(form.locator('button[type="submit"]')).toBeVisible()
})

test('component previews come from the theme, not from copied markup', async ({ page }) => {
  await page.goto(PAGE)

  // taxonomy-cloud, cta-button and alert-wrapper, each called live.
  expect(await page.locator('.tagcloud-item').count()).toBeGreaterThan(0)
  expect(await page.locator('a:has(> span.rounded-full)').count()).toBeGreaterThanOrEqual(3)
  await expect(page.getByText('Yellow — and this yellow is semantic')).toBeVisible()
})

test('the empty state renders on a section that is genuinely empty', async ({ page }) => {
  // Before v0.4.0 this code path existed but no exampleSite page reached it, so
  // nothing built or tested it. The section exists to keep that honest.
  await page.goto(`${BASE}/docs/empty-section/`)

  await expect(page.locator('.border-dashed')).toBeVisible()
  await expect(page.getByText('Nothing here yet')).toBeVisible()
  // The blank grid and the single-page pager it replaced.
  await expect(page.locator('.pagination')).toHaveCount(0)
})
