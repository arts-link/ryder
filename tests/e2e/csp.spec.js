import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const BASE = '/ryder'

/** Walk up from the working directory to the repo root (the dir with theme.toml). */
function findRepoRoot(start) {
  let dir = path.resolve(start)
  for (;;) {
    if (fs.existsSync(path.join(dir, 'theme.toml'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) throw new Error(`could not find theme.toml above ${start}`)
    dir = parent
  }
}
const REPO = findRepoRoot(process.cwd())

// Regression coverage for item 4.3.
//
// Two compounding problems, both fixed:
//   1. posthog.html inlined its bootstrap snippet, so csp.html appended
//      'unsafe-inline' to script-src for EVERY PostHog site — the CSP's most
//      valuable directive, given away as a side effect of enabling analytics.
//   2. The policy ships as <meta http-equiv>, which cannot carry a nonce, so a
//      site with one inline script of its own had no option but blanket
//      'unsafe-inline'. params.csp.scriptSrcHashes now covers that case.

/** Parse the emitted CSP meta tag into a directive -> sources map. */
function parsePolicy(content) {
  const out = {}
  for (const part of content.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/)
    if (name) out[name] = sources
  }
  return out
}

async function policyFromPage(page) {
  const content = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content')
  expect(content).toBeTruthy()
  return parsePolicy(content)
}

test('style-src keeps its documented unsafe-inline allowance', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const policy = await policyFromPage(page)
  // Alpine's x-show writes display:none as an inline style. This one is a real
  // constraint, and csp.html documents it — asserted so that a future tightening
  // of style-src is a deliberate change rather than an accident.
  expect(policy['style-src']).toContain("'unsafe-inline'")
})

// Loading the real pages and watching the console is the only check that
// catches a policy which is well-formed but wrong. Spec Verification check 2.
for (const page_path of ['/', '/docs/', '/docs/leaflet-maps/', '/docs/rich-content/']) {
  test(`no CSP violations in the console on ${page_path}`, async ({ page }) => {
    const violations = []
    page.on('console', (msg) => {
      const text = msg.text()
      // A violation is something the browser BLOCKED. Chromium also logs an
      // informational notice that 'frame-ancestors' is ignored in a <meta>
      // CSP — true, and inert rather than broken, so it is not a violation.
      const blocked =
        /Refused to (load|execute|apply|connect|frame|run)/i.test(text) ||
        /violates the following Content Security Policy directive/i.test(text)
      if (blocked) violations.push(text)
    })
    // Drop third-party requests. /docs/rich-content/ embeds YouTube, Spotify,
    // SoundCloud and uMap; letting those load makes the test depend on four
    // external services being reachable, and they hold connections open long
    // enough that 'networkidle' never settles on a machine with real network
    // access. Aborting them cannot mask what this test asserts: CSP blocking
    // happens in the renderer BEFORE the request is issued, so a "Refused to
    // load/frame" console message still fires for anything the policy rejects.
    await page.route('**/*', (route) => {
      const host = new URL(route.request().url()).hostname
      return host === '127.0.0.1' || host === 'localhost'
        ? route.continue()
        : route.abort()
    })
    await page.goto(`${BASE}${page_path}`, { waitUntil: 'load' })
    // Violations are emitted as the parser and scripts run, but a few land just
    // after 'load'. Bounded settle rather than 'networkidle', which is not
    // deterministic here.
    await page.waitForTimeout(750)
    expect(violations, violations.join('\n')).toHaveLength(0)
  })
}

// Per CSP Level 2+, a hash source in script-src makes 'unsafe-inline' INERT.
// csp.html therefore emits scriptSrcHashes (and the Plausible advanced-mode
// hashes) in production only — otherwise configuring a hash would silently
// neutralize the development allowance below and break LiveReload, plus any
// inline script, for exactly the sites that opted into hashes.
//
// This bit a real consumer: hashes leaked into the dev CSP, the browser
// discarded 'unsafe-inline', and a working page went dead with the console
// naming a *different* hash — different because `hugo --minify` changes the
// bytes a hash covers, so a production hash never matches an unminified build.
test('the dev CSP keeps unsafe-inline and emits no hashes', async ({ page }) => {
  await page.goto(`${BASE}/`)
  const policy = await policyFromPage(page)
  const scriptSrc = policy['script-src']
  expect(scriptSrc).toContain("'unsafe-inline'")
  expect(
    scriptSrc.filter((s) => s.startsWith("'sha")),
    `a hash in dev would make 'unsafe-inline' inert: ${scriptSrc.join(' ')}`
  ).toHaveLength(0)
})

// The dev server runs with hugo.IsProduction false, where csp.html deliberately
// allows inline scripts (LiveReload injects one) and head.html does not render
// analytics at all. So the PostHog behaviour can only be asserted against a
// production build, which this builds on the fly against a throwaway consumer
// site — which doubles as a check that the theme works from a project root that
// is not exampleSite.
test.describe('production PostHog bootstrap', () => {
  let html = ''
  let outDir = ''

  test.beforeAll(() => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ryder-csp-'))
    outDir = path.join(dir, 'public')
    fs.mkdirSync(path.join(dir, 'content'), { recursive: true })
    fs.writeFileSync(
      path.join(dir, 'hugo.toml'),
      [
        `baseURL = 'https://consumer.example.com/'`,
        `title = 'CSP fixture'`,
        `theme = 'ryder'`,
        `themesDir = '${path.dirname(REPO)}'`,
        ``,
        `[params]`,
        `  analytics_provider = 'posthog'`,
        `  posthog_key = 'phc_fixture_key'`,
        `  posthog_host = 'https://us.i.posthog.com'`,
        `  [params.csp]`,
        `    scriptSrcHashes = ["sha256-Ryd3rExampleHashAAAAAAAAAAAAAAAAAAAAAAAAAAA="]`,
      ].join('\n')
    )
    fs.writeFileSync(path.join(dir, 'content', '_index.md'), '---\ntitle: Home\n---\n')
    // js.Build and PostCSS resolve from the project root, so borrow the ones
    // exampleSite already installed rather than running a second npm install.
    fs.symlinkSync(path.join(REPO, 'exampleSite', 'node_modules'), path.join(dir, 'node_modules'))
    fs.writeFileSync(
      path.join(dir, 'postcss.config.js'),
      'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }\n'
    )
    fs.writeFileSync(
      path.join(dir, 'tailwind.config.js'),
      `module.exports = {\n` +
        `  presets: [require(${JSON.stringify(path.join(REPO, 'tailwind.preset.js'))})],\n` +
        `  content: [${JSON.stringify(path.join(REPO, 'layouts/**/*.html'))}, './content/**/*.md'],\n` +
        `}\n`
    )

    execFileSync('hugo', ['--minify', '--environment', 'production', '--destination', outDir], {
      cwd: dir,
      stdio: 'pipe',
    })
    html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8')
  })

  test('script-src drops unsafe-inline for a PostHog site', () => {
    const content = html.match(/Content-Security-Policy["']?\s+content="(.*?)"/s)[1]
    const policy = parsePolicy(content.replace(/&#39;/g, "'").replace(/&amp;/g, '&'))
    expect(policy['script-src']).not.toContain("'unsafe-inline'")
    // PostHog's own asset host is still needed — the bootstrap fetches array.js
    // from it — but that is a host allowance, not an inline allowance.
    expect(policy['script-src']).toContain('https://us-assets.i.posthog.com')
    expect(policy['script-src']).toContain(
      "'sha256-Ryd3rExampleHashAAAAAAAAAAAAAAAAAAAAAAAAAAA='"
    )
  })

  test('the PostHog bootstrap loads via src with an integrity hash', () => {
    const tags = html.match(/<script\b[^>]*posthog-bootstrap[^>]*>/g) || []
    expect(tags).toHaveLength(1)
    expect(tags[0]).toMatch(/\bsrc=/)
    expect(tags[0]).toMatch(/\bintegrity="sha\d{3}-/)
  })

  test('the bootstrap is no longer inlined anywhere in the page', () => {
    // A fragment unique to PostHog's snippet. If it appears in the HTML, the
    // snippet is inline again and the 'unsafe-inline' removal above is a lie.
    expect(html).not.toContain('!function(t,e){var o,n,p,r;e.__SV')
  })

  test('no executable inline script survives in the production page', () => {
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>(.*?)<\/script>/gs)]
    const executable = inline.filter(
      ([, attrs, body]) => body.trim() && !/ld\+json/.test(attrs)
    )
    expect(executable.map(([m]) => m.slice(0, 120))).toEqual([])
  })
})
