import { test, expect } from '@playwright/test'

const BASE = '/ryder'

// card-category-color.html used to drop `.Summary` into the card as raw HTML.
// When a page has no <!--more--> marker and no `summary` front-matter key, Hugo
// builds `.Summary` by truncating the RENDERED HTML at summaryLength words, and
// that cut is not guaranteed to land on an element boundary — a summary can end
// with its wrapper elements still open. The browser then re-parents everything
// that follows into the open element, so one content page silently swallowed
// every card after it on the feed page (issue #86).
//
// The card now runs the fallback branch through plainify, which makes the
// failure impossible to express rather than fixing the one page that tripped
// it. These assertions pin that: card summaries are text, and cards are
// siblings.

const FEED_PAGES = [`${BASE}/`, `${BASE}/docs/`, `${BASE}/docs/page/2/`]

// The read-on button partial renders inside the same wrapper as the summary and
// is the one element a card body may legitimately contain.
const summaryMarkup = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.article .articleBody')].map((body) => {
      const clone = body.cloneNode(true)
      clone.querySelectorAll(':scope > div.justify-end').forEach((btn) => btn.remove())
      return {
        title: body.closest('.article').querySelector('h2')?.textContent.trim() ?? '',
        tags: [...clone.children].map((el) => el.tagName.toLowerCase()),
      }
    }),
  )

for (const url of FEED_PAGES) {
  test(`card summaries on ${url} carry no markup`, async ({ page }) => {
    await page.goto(url)

    const cards = await summaryMarkup(page)
    expect(cards.length).toBeGreaterThan(0)

    const withMarkup = cards.filter((card) => card.tags.length > 0)
    expect(
      withMarkup,
      `card summaries should be plain text: ${JSON.stringify(withMarkup)}`,
    ).toEqual([])
  })
}

test('cards on a feed page stay siblings', async ({ page }) => {
  // The observable symptom of an unbalanced summary: the cards that follow the
  // offending one are parsed inside it instead of alongside it. This holds for
  // any source of stray markup in a card, not only the summary.
  await page.goto(`${BASE}/docs/`)

  const nested = await page.evaluate(
    () =>
      [...document.querySelectorAll('.article')].filter((article) =>
        article.parentElement.closest('.article'),
      ).length,
  )
  expect(nested).toBe(0)
})

test('an author-written homeFeatureSummary still wins over the summary', async ({ page }) => {
  // plainify guards the fallback branch only; the opt-in front-matter blurb is
  // untouched, so a page that sets one still renders it verbatim.
  await page.goto(`${BASE}/`)

  const card = page.locator('.article', { hasText: 'Featured Content' }).first()
  await expect(card.locator('.articleBody')).toContainText(
    'Ryder gives you a couple ways to feature content on the home page',
  )
})
