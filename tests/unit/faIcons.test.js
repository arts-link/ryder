/**
 * Font Awesome icon audit.
 *
 * Parses main.js to extract every icon imported into the FA library, then
 * scans layouts/ and exampleSite/ for fa-* class references and asserts that
 * every icon used in the codebase has a matching import.
 *
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '../..')

// ── helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect all files matching an extension list under a directory. */
function walkFiles(dir, exts, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      // Skip node_modules
      if (entry === 'node_modules') continue
      walkFiles(full, exts, results)
    } else if (exts.some(e => full.endsWith(e))) {
      results.push(full)
    }
  }
  return results
}

/**
 * Convert a kebab-case FA icon name to the camelCase name used in JS imports.
 * Handles the `far` alias prefix for regular icons.
 *   'fa-camera-retro'  → 'faCameraRetro'
 *   'fa-envelope' (regular prefix 'far') → 'farEnvelope'
 */
function toCamel(kebab, prefix = 'fa') {
  return prefix + kebab
    .replace(/^fa-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

// ── parse imports from main.js ────────────────────────────────────────────────

const mainJs = readFileSync(join(ROOT, 'assets/js/main.js'), 'utf8')

/** Extract every identifier passed to library.add(...) */
function parseLibraryAdd(src) {
  const m = src.match(/library\.add\(([\s\S]*?)\)/)
  if (!m) return new Set()
  return new Set(
    m[1]
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => /^fa[rbs]?[A-Z]/.test(s))
  )
}

const importedIcons = parseLibraryAdd(mainJs)

// ── scan source files for fa- class references ────────────────────────────────

const scanDirs = [
  join(ROOT, 'layouts'),
  join(ROOT, 'exampleSite/content'),
  join(ROOT, 'exampleSite/config'),
  join(ROOT, 'exampleSite/data'),
]

const SOURCE_EXTS = ['.html', '.md', '.toml', '.json']

/**
 * Returns {camelName, source, prefix} for every unique FA icon class
 * found in the scanned files.
 *
 * Patterns matched:
 *   fa-solid fa-<name>          → faCamelName  (solid)
 *   fas fa-<name>               → faCamelName  (solid)
 *   fa-regular fa-<name>        → farCamelName (regular)
 *   far fa-<name>               → farCamelName (regular)
 *   fab fa-<name>               → faCamelName  (brands — FA doesn't prefix brands)
 *   fa-brands fa-<name>         → faCamelName  (brands)
 */
function scanForIconUsages(dirs) {
  const found = new Map() // camelName → { camelName, files }

  const SOLID_RE   = /(?:fa-solid|fas)\s+fa-([\w-]+)/g
  const REGULAR_RE = /(?:fa-regular|far)\s+fa-([\w-]+)/g
  const BRAND_RE   = /(?:fa-brands|fab)\s+fa-([\w-]+)/g

  // Files that contain example icon class strings (not real usages)
  const SKIP_FILES = new Set([
    join(ROOT, 'layouts/shortcodes/font-awesome.html'),
  ])

  for (const dir of dirs) {
    for (const file of walkFiles(dir, SOURCE_EXTS)) {
      if (SKIP_FILES.has(file)) continue
      const src = readFileSync(file, 'utf8')

      for (const [, name] of src.matchAll(SOLID_RE)) {
        const camel = toCamel(name, 'fa')
        if (!found.has(camel)) found.set(camel, { camel, files: [] })
        found.get(camel).files.push(file.replace(ROOT + '/', ''))
      }
      for (const [, name] of src.matchAll(REGULAR_RE)) {
        const camel = toCamel(name, 'far')
        if (!found.has(camel)) found.set(camel, { camel, files: [] })
        found.get(camel).files.push(file.replace(ROOT + '/', ''))
      }
      for (const [, name] of src.matchAll(BRAND_RE)) {
        const camel = toCamel(name, 'fa')
        if (!found.has(camel)) found.set(camel, { camel, files: [] })
        found.get(camel).files.push(file.replace(ROOT + '/', ''))
      }
    }
  }
  return found
}

const usedIcons = scanForIconUsages(scanDirs)

// ── tests ─────────────────────────────────────────────────────────────────────

describe('Font Awesome icon audit', () => {
  it('every FA icon referenced in templates/content is imported in main.js', () => {
    const missing = []
    for (const [camel, { files }] of usedIcons) {
      if (!importedIcons.has(camel)) {
        missing.push({ camel, files })
      }
    }

    if (missing.length > 0) {
      const detail = missing
        .map(({ camel, files }) => `  ${camel}  (${files[0]})`)
        .join('\n')
      expect.fail(
        `${missing.length} icon(s) used but NOT imported in assets/js/main.js:\n${detail}\n` +
        `Add them to the import block and library.add() call in main.js.`
      )
    }
  })

  it('main.js imports at least one icon', () => {
    expect(importedIcons.size).toBeGreaterThan(0)
  })

  it('every FA icon imported in main.js is referenced in templates/content', () => {
    const unused = []
    for (const camel of importedIcons) {
      if (!usedIcons.has(camel)) {
        unused.push(camel)
      }
    }

    if (unused.length > 0) {
      expect.fail(
        `${unused.length} icon(s) imported in assets/js/main.js but NOT used anywhere:\n` +
        unused.map(c => `  ${c}`).join('\n') + '\n' +
        `Remove them from the import block and library.add() call in main.js.`
      )
    }
  })
})
