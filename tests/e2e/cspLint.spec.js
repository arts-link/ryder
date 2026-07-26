import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// The dev-only CSP-Alpine linter. Its value depends entirely on staying quiet
// about correct code: a linter that warns on the theme's own working partials
// gets tuned out, which is how three silent outages stayed invisible. So the
// important assertion here is the *absence* of warnings on real pages.

/** Collect [ryder:csp-lint] console warnings while loading a page. */
async function lintWarnings(page, path) {
  const warnings = []
  const onMsg = (m) => { if (m.text().includes('csp-lint')) warnings.push(m.text()) }
  page.on('console', onMsg)
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.__ryderCspLint === 'function')
  await page.waitForTimeout(400)
  page.off('console', onMsg)
  return warnings
}

// These pages between them exercise every Alpine component the theme ships,
// including the ones that legitimately call scope methods with arguments
// (`toggle()`, `open.toString()`, `imageGalleryNext()`, `isValidAsin(asin)`).
const CLEAN_PAGES = [
  '/',
  '/docs/',
  '/docs/analytics/',
  '/docs/forms/',
  '/docs/affiliate-marketing-tools/',
  '/docs/image-galleries/',
]

for (const path of CLEAN_PAGES) {
  test(`csp lint reports nothing on ${path}`, async ({ page }) => {
    expect(await lintWarnings(page, path)).toEqual([])
  })
}

test('csp lint flags a global reference and an arrow function', async ({ page }) => {
  const warnings = []
  page.on('console', (m) => { if (m.text().includes('csp-lint')) warnings.push(m.text()) })

  await page.goto(`${BASE}/docs/analytics/`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.__ryderCspLint === 'function')

  // The exact pattern behind the outages, plus an arrow function.
  await page.evaluate(() => {
    document.querySelector('main').insertAdjacentHTML(
      'beforeend',
      '<div id="bad-global" x-data="ryderTrack" @click="posthog.capture(\'x\')">a</div>'
      + '<div id="bad-arrow" x-data="ryderTrack" @click="$nextTick(() => 1)">b</div>',
    )
  })

  const found = await page.evaluate(() => window.__ryderCspLint())
  expect(found).toBe(2)

  const text = warnings.join('\n')
  expect(text).toContain('posthog')
  expect(text).toContain('#bad-global')
  expect(text).toContain('Arrow function')
  expect(text).toContain('#bad-arrow')
  // It points at the fix.
  expect(text).toContain('Alpine.data()')
})

test('csp lint is development-only and never ships', async ({ page }) => {
  // The dev server runs hugo in the development environment, so the script is
  // present here; the production build is asserted at build time (no
  // cspLint.js asset is emitted at all).
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  const scripts = await page.evaluate(
    () => Array.from(document.querySelectorAll('script[src]')).map((s) => s.getAttribute('src')),
  )
  expect(scripts.some((s) => s.includes('cspLint'))).toBe(true)
})
