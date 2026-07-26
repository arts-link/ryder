import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression test for the failure mode behind three silent production outages:
// @alpinejs/csp cannot evaluate function calls, member calls, or arrow
// functions inside inline directives, and it does not throw when it meets one.
// An inline `@click="posthog.capture('x')"` therefore renders fine, logs
// nothing, and never fires. `ryderTrack` exists so the handler is a real
// Alpine.data method — this test proves the event actually reaches the
// provider.

/** Install a window.posthog stub that records every capture() call. */
async function stubPostHog(page) {
  await page.addInitScript(() => {
    window.__ryderCaptures = []
    window.posthog = {
      capture(name, props) {
        window.__ryderCaptures.push({ name, props })
      },
    }
  })
}

const captures = (page) => page.evaluate(() => window.__ryderCaptures || [])

test('ryderTrack forwards the click to the analytics provider with event name and props', async ({ page }) => {
  await stubPostHog(page)
  await page.goto(`${BASE}/docs/analytics/`)

  const button = page.locator('#ryder-track-demo')
  await expect(button).toBeVisible()

  // Nothing captured before the click.
  await expect.poll(() => captures(page)).toEqual([])

  await button.click()

  await expect.poll(() => captures(page)).toEqual([
    {
      name: 'demo_click',
      props: { source: 'exampleSite', page: 'analytics' },
    },
  ])
})

test('ryderTrack sends one event per click', async ({ page }) => {
  await stubPostHog(page)
  await page.goto(`${BASE}/docs/analytics/`)

  const button = page.locator('#ryder-track-demo')
  await button.click()
  await button.click()

  await expect.poll(() => captures(page).then((c) => c.length)).toBe(2)
  const recorded = await captures(page)
  expect(recorded.every((c) => c.name === 'demo_click')).toBe(true)
})

test('ryderTrack still fires when data-track-props is invalid JSON', async ({ page }) => {
  await stubPostHog(page)

  const warnings = []
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text())
  })

  await page.goto(`${BASE}/docs/analytics/`)
  // Wait for Alpine to have booted the demo component before mutating the DOM,
  // so we know the MutationObserver that picks up the new node is running.
  await expect(page.locator('#ryder-track-demo')).toBeVisible()

  // insertAdjacentHTML so the HTML parser handles the `@click` attribute name
  // (setAttribute rejects '@' as an attribute name, the parser does not).
  await page.evaluate(() => {
    document.querySelector('main').insertAdjacentHTML(
      'beforeend',
      '<button type="button" id="ryder-track-broken" x-data="ryderTrack"'
      + ' @click="track" data-track-event="broken_props_click"'
      + " data-track-props='{not valid json}'>broken</button>",
    )
  })

  await page.locator('#ryder-track-broken').click()

  // The event still reaches the provider — malformed props degrade to {},
  // they do not kill the handler (which is often also doing a navigation).
  await expect.poll(() => captures(page)).toEqual([
    { name: 'broken_props_click', props: {} },
  ])

  expect(warnings.some((w) => w.includes('data-track-props'))).toBe(true)
})

test('ryderTrack does not throw when no analytics provider is present', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(err.message))

  // No window.posthog stub at all — the common real-world case of an ad
  // blocker eating the provider script.
  await page.goto(`${BASE}/docs/analytics/`)

  const button = page.locator('#ryder-track-demo')
  await expect(button).toBeVisible()
  await button.click()

  expect(pageErrors).toEqual([])
})
