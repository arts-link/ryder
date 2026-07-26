import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// Regression coverage for item 5.2: a video lightbox beside main.js's
// existing imageGallery (images only). The trigger button carries the embed
// URL as a data attribute (CSP-safe: no inline calls), and the iframe's src
// is only populated once the modal actually opens.

test('video-lightbox opens a modal with the video iframe on click, and closes on Escape', async ({ page }) => {
  await page.goto(`${BASE}/docs/rich-content/`)

  const trigger = page.getByRole('button', { name: 'Rob Pike at Gopherfest' })
  await expect(trigger).toBeVisible()

  // Nothing requested from the embed host before the click: the iframe
  // element exists (for x-show to toggle) but its src is empty.
  const iframe = page.locator('iframe[title="Rob Pike at Gopherfest"]')
  await expect(iframe).not.toBeVisible()
  await expect(iframe).not.toHaveAttribute('src', /./)

  await trigger.click()

  await expect(iframe).toBeVisible()
  await expect(iframe).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/VLvVNMbQIRY/)

  await page.keyboard.press('Escape')
  await expect(iframe).not.toBeVisible()
})
