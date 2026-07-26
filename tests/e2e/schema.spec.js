import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 2.2. head/schema.html used to hand-write JSON as
// template text, which meant every emitted block failed to parse — silently,
// since Hugo has no idea what is inside a <script> tag. It is now built from
// Hugo dicts and serialised with jsonify, and this suite asserts the property
// that actually matters: the output parses.

/** Return the parsed contents of every application/ld+json block on the page. */
async function jsonLd(page) {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents()
  return raw.map((text, i) => {
    try {
      return JSON.parse(text)
    } catch (err) {
      throw new Error(`JSON-LD block ${i} failed to parse: ${err.message}\n${text.slice(0, 400)}`)
    }
  })
}

const typesOf = (blocks) =>
  blocks.flatMap((b) => (Array.isArray(b) ? b : [b])).map((b) => b['@type'])

test('every JSON-LD block on the home page parses', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const blocks = await jsonLd(page)
  expect(blocks.length).toBeGreaterThan(0)
  expect(typesOf(blocks)).toContain('WebPage')
})

test('every JSON-LD block on a post parses, with breadcrumbs', async ({ page }) => {
  await page.goto(`${BASE}/docs/recipe-lemon-chia-granola/`)
  const blocks = await jsonLd(page)
  const types = typesOf(blocks)
  expect(types).toContain('BlogPosting')
  expect(types).toContain('BreadcrumbList')
  // The page has categories, so it gets a taxonomy trail as well as a section one.
  expect(types.filter((t) => t === 'BreadcrumbList').length).toBe(2)
})

// The recipe demo page's own front matter used to declare `recipe = true` after
// a [menu] table, so TOML absorbed it into menu.main and the Recipe block was
// never emitted at all. Assert the type is present, not merely that whatever
// is present parses.
test('the recipe page emits a Recipe block with ingredients and steps', async ({ page }) => {
  await page.goto(`${BASE}/docs/recipe-lemon-chia-granola/`)
  const blocks = await jsonLd(page)
  const recipe = blocks.find((b) => b['@type'] === 'Recipe')
  expect(recipe).toBeTruthy()
  expect(recipe.recipeIngredient.length).toBeGreaterThan(0)
  expect(recipe.recipeInstructions.length).toBeGreaterThan(0)
  expect(recipe.recipeInstructions[0]['@type']).toBe('HowToStep')
})

// params.schema.type selects the site-wide entity without overriding any file.
test('the home page carries the site-wide entity from params.schema.type', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const blocks = await jsonLd(page)
  const entity = blocks.find((b) => b['@type'] === 'Organization')
  expect(entity).toBeTruthy()
  expect(entity.url).toBeTruthy()
  expect(entity.name).toBeTruthy()
})

// The whole point of the hook: a site ADDS a type and keeps the theme's blocks.
// exampleSite shadows head/schema-extra.html with a SoftwareSourceCode block.
test('head/schema-extra.html adds a type without displacing the theme blocks', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const blocks = await jsonLd(page)
  const types = typesOf(blocks)
  expect(types).toContain('SoftwareSourceCode')
  // ...and the theme's own blocks are all still there.
  expect(types).toContain('WebPage')
  expect(types).toContain('Organization')

  const extra = blocks.find((b) => b['@type'] === 'SoftwareSourceCode')
  expect(extra.codeRepository).toBe('https://github.com/arts-link/ryder')
})

// The hook is home-gated in exampleSite, so it must not leak onto other pages —
// this proves the assertion above is reading the hook rather than something
// the theme emits unconditionally.
test('the schema-extra hook only fires where its own guard allows', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  const types = typesOf(await jsonLd(page))
  expect(types).not.toContain('SoftwareSourceCode')
})

// Regression for the three mismatched homepage tests the rewrite removed
// (eq .Title .Site.Title / .IsHome / ne .Title .Site.Title). A non-home page
// must never receive the homepage WebPage block or the site-wide entity.
test('a non-home page does not receive homepage schema', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  const blocks = await jsonLd(page)
  const top = blocks.map((b) => b['@type'])
  expect(top).toContain('BlogPosting')
  expect(top).not.toContain('Organization')
  // mainEntityOfPage is a nested WebPage; no top-level WebPage block.
  expect(top).not.toContain('WebPage')
})

// articleBody used to inline the entire rendered page into every BlogPosting.
test('BlogPosting does not inline the whole page body', async ({ page }) => {
  await page.goto(`${BASE}/docs/alerts/`)
  const post = (await jsonLd(page)).find((b) => b['@type'] === 'BlogPosting')
  expect(post.articleBody).toBeUndefined()
  // Dates are RFC 3339, not Go's default time formatting.
  if (post.datePublished) {
    expect(post.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  }
})
