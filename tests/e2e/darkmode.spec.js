import { test, expect } from '@playwright/test'

const BASE = '/ryder'

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

test('dismissable alert can be closed', async ({ page }) => {
  // Clear the cookie so the alert is visible
  await page.context().clearCookies()
  await page.goto(`${BASE}/`)

  const alert = page.locator('[role="alert"]').first()
  await expect(alert).toBeVisible()

  await alert.getByRole('button', { name: /dismiss/i }).click()
  await expect(alert).not.toBeVisible()
})
