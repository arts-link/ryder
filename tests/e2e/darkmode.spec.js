import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// The one exampleSite page that renders both aside blocks: tag chips and the TOC.
const ASIDE_PAGE = `${BASE}/docs/table-of-contents/`

// The value `property` is declared with in the stylesheet rule for `selector`,
// normalized through a throwaway element so it compares equal to what
// getComputedStyle returns. Returns null when no such rule declares it, which
// is itself a failure worth catching. Reading the palette out of the stylesheet
// instead of hardcoding rose-950 keeps these assertions about the cascade —
// does the `dark:` rule win? — and not about which colour the theme picked.
async function declaredValue(page, selector, property) {
  return page.evaluate(
    ([selector, property]) => {
      for (const sheet of document.styleSheets) {
        let rules
        try {
          rules = sheet.cssRules
        } catch {
          continue // cross-origin (the Google Fonts sheet)
        }
        for (const rule of rules) {
          if (rule.selectorText !== selector) continue
          const declared = rule.style.getPropertyValue(property)
          if (!declared) continue
          const probe = document.createElement('div')
          probe.style.setProperty(property, declared)
          document.body.append(probe)
          const normalized = getComputedStyle(probe).getPropertyValue(property)
          probe.remove()
          return normalized
        }
      }
      return null
    },
    [selector, property]
  )
}

async function switchToDark(page) {
  // The switcher cycles system -> light -> dark, so light comes first.
  await page.getByRole('button', { name: /light theme/i }).click()
  await page.getByRole('button', { name: /dark theme/i }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
}

test('dark mode toggle buttons are present on the page', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  const themeSwitcher = page.locator('#themeSwitcher')
  await expect(themeSwitcher).toBeVisible()
  await expect(themeSwitcher.locator('#lightMode')).toBeAttached()
  await expect(themeSwitcher.locator('#darkMode')).toBeAttached()
  await expect(themeSwitcher.locator('#systemMode')).toBeAttached()
})

test('clicking system button cycles to light mode', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  // Default is system mode — the system button (#systemMode) is visible
  await page.getByRole('button', { name: /light theme/i }).click()
  const html = page.locator('html')
  await expect(html).not.toHaveClass(/dark/)
})

test('clicking light button cycles to dark mode', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  // Get into light mode first
  await page.getByRole('button', { name: /light theme/i }).click()
  // Now click the light (sun) button to go dark
  await page.getByRole('button', { name: /dark theme/i }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('dark mode preference persists across page reload', async ({ page }) => {
  await page.goto(`${BASE}/docs/`)
  // Cycle to light then to dark
  await page.getByRole('button', { name: /light theme/i }).click()
  await page.getByRole('button', { name: /dark theme/i }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

// `.aside-taxonomy-link` and `.aside-toc-links a` build their dark styles from
// `@apply dark:*` split across several statements inside `@layer components`.
// Tailwind emits those as a separate `:is(.dark *)` rule that has to out-weigh
// the base rule on specificity alone. These lock that in. They also ride out
// the chips' 150ms `transition-colors`: toHaveCSS retries, so it settles on the
// end value rather than sampling the transition's light starting value.
test('aside tag chips take their dark styles in dark mode', async ({ page }) => {
  await page.goto(ASIDE_PAGE)
  const chip = page.locator('.aside-taxonomy-link').first()
  await expect(chip).toBeVisible()

  const properties = ['background-color', 'border-color', 'color']
  const light = {}
  for (const property of properties) {
    light[property] = await declaredValue(page, '.aside-taxonomy-link', property)
    expect(light[property], `.aside-taxonomy-link declares no ${property}`).toBeTruthy()
  }

  await switchToDark(page)

  for (const property of properties) {
    const dark = await declaredValue(page, '.aside-taxonomy-link:is(.dark *)', property)
    expect(dark, `no dark rule declares ${property}`).toBeTruthy()
    expect(dark, `the dark ${property} is the light one`).not.toBe(light[property])
    await expect(chip).toHaveCSS(property, dark)
  }
})

test('aside TOC links take their dark hover background', async ({ page }) => {
  await page.goto(ASIDE_PAGE)
  const link = page.locator('.aside-toc-links a').first()
  await expect(link).toBeVisible()

  await switchToDark(page)

  const hoverBackground = await declaredValue(
    page,
    '.aside-toc-links a:hover:is(.dark *)',
    'background-color'
  )
  expect(hoverBackground, 'no dark hover rule declares background-color').toBeTruthy()

  await link.hover()
  await expect(link).toHaveCSS('background-color', hoverBackground)
})

test('dismissable alert can be closed', async ({ page }) => {
  // Clear the cookie so the alert is visible
  await page.context().clearCookies()
  await page.goto(`${BASE}/`)

  const alert = page.locator('[role="alert"]').first()
  await expect(alert).toBeVisible()

  await alert.getByRole('button', { name: /dismiss/i }).click()
  await expect(alert).not.toBeVisible()
})
