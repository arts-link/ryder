import { test, expect } from '@playwright/test'

const BASE = '/ryder'
const ACTION = `${BASE}/api/demo-subscribe`

// ryderForm exists because @alpinejs/csp silently refuses to evaluate an inline
// `@submit="fetch(...)"`. These tests exercise the component end to end so the
// primitive cannot ship in the same silently-dead state it was written to
// prevent — including the getters, which are the only reason `x-show` can work
// at all under the CSP evaluator (it cannot evaluate `status === 'success'`).

test('ryderForm POSTs the form as JSON and reports success', async ({ page }) => {
  let request = null
  await page.route(`**${ACTION}`, async (route) => {
    request = {
      method: route.request().method(),
      contentType: route.request().headers()['content-type'],
      body: route.request().postDataJSON(),
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await page.goto(`${BASE}/docs/forms/`)
  const form = page.locator('#ryder-form-demo')
  await expect(form).toBeVisible()

  await form.locator('input[name="email"]').fill('someone@example.com')
  await form.locator('button[type="submit"]').click()

  await expect(page.locator('#ryder-form-demo-success')).toBeVisible()
  await expect(page.locator('#ryder-form-demo-error')).toBeHidden()

  expect(request).not.toBeNull()
  expect(request.method).toBe('POST')
  expect(request.contentType).toContain('application/json')
  // The honeypot is never sent.
  expect(request.body).toEqual({ email: 'someone@example.com' })
})

test('ryderForm reports the error state when the endpoint fails', async ({ page }) => {
  await page.route(`**${ACTION}`, (route) => route.fulfill({ status: 500, body: 'nope' }))

  await page.goto(`${BASE}/docs/forms/`)
  const form = page.locator('#ryder-form-demo')

  await form.locator('input[name="email"]').fill('someone@example.com')
  await form.locator('button[type="submit"]').click()

  const error = page.locator('#ryder-form-demo-error')
  await expect(error).toBeVisible()
  await expect(error).toContainText('error state')
  await expect(page.locator('#ryder-form-demo-success')).toBeHidden()
})

test('ryderForm short-circuits when the _gotcha honeypot is filled', async ({ page }) => {
  let called = false
  await page.route(`**${ACTION}`, (route) => {
    called = true
    return route.fulfill({ status: 200, body: '{}' })
  })

  await page.goto(`${BASE}/docs/forms/`)
  const form = page.locator('#ryder-form-demo')

  await form.locator('input[name="email"]').fill('bot@example.com')
  // The honeypot is display:none, so fill it the way a bot would.
  await page.evaluate(() => {
    document.querySelector('#ryder-form-demo input[name="_gotcha"]').value = 'i am a bot'
  })
  await form.locator('button[type="submit"]').click()

  // Reports success to the bot, but nothing is ever sent.
  await expect(page.locator('#ryder-form-demo-success')).toBeVisible()
  expect(called).toBe(false)
})

test('ryderForm fires data-track-event on success only', async ({ page }) => {
  await page.addInitScript(() => {
    window.__ryderCaptures = []
    window.posthog = {
      capture(name, props) { window.__ryderCaptures.push({ name, props }) },
    }
  })
  await page.route(`**${ACTION}`, (route) => route.fulfill({ status: 500, body: 'nope' }))

  await page.goto(`${BASE}/docs/forms/`)
  // Attach a tracked event to the demo form at runtime.
  await page.evaluate(() => {
    document.querySelector('#ryder-form-demo').dataset.trackEvent = 'demo_signup'
  })

  const form = page.locator('#ryder-form-demo')
  await form.locator('input[name="email"]').fill('someone@example.com')
  await form.locator('button[type="submit"]').click()

  // Failure: no event.
  await expect(page.locator('#ryder-form-demo-error')).toBeVisible()
  expect(await page.evaluate(() => window.__ryderCaptures)).toEqual([])

  // Now let it succeed.
  await page.unroute(`**${ACTION}`)
  await page.route(`**${ACTION}`, (route) => route.fulfill({ status: 200, body: '{}' }))
  await form.locator('input[name="email"]').fill('someone@example.com')
  await form.locator('button[type="submit"]').click()

  await expect(page.locator('#ryder-form-demo-success')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.__ryderCaptures)).toEqual([
    { name: 'demo_signup', props: {} },
  ])
})
