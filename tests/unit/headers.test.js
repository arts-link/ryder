/**
 * static/_headers overlap check (arts-link/ryder#115).
 *
 * Cloudflare applies every rule whose path matches a request and joins the
 * values of a header set by more than one of them, so two rules that can match
 * the same path must never set the same header. This parses the file, makes
 * sample paths from each rule's pattern, and fails if another rule setting the
 * same header also matches one of them.
 *
 * Pattern syntax (Cloudflare/Netlify): `*` is a splat that matches across `/`;
 * `:name` is a placeholder matching one path segment.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const FILE = resolve(import.meta.dirname, '../../static/_headers')

function parseRules(text) {
  const rules = []
  let current = null
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue
    if (/^\s/.test(raw)) {
      const [name] = raw.trim().split(':')
      current.headers.push(name.trim().toLowerCase())
    } else {
      current = { pattern: raw.trim(), headers: [] }
      rules.push(current)
    }
  }
  return rules
}

function toRegExp(pattern) {
  const body = pattern
    .split(/(\*|:[A-Za-z]+)/)
    .map((part) => {
      if (part === '*') return '.*'
      if (part.startsWith(':')) return '[^/]+'
      return part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('')
  return new RegExp(`^${body}$`)
}

// Paths a pattern matches: splats filled with nothing, one segment and several.
function samplePaths(pattern) {
  return ['', 'x.css', 'images/x.png', 'a/b/c'].map((fill) =>
    pattern.replace(/:[A-Za-z]+/g, 'seg').replace(/\*/g, fill),
  )
}

describe('static/_headers', () => {
  const rules = parseRules(readFileSync(FILE, 'utf8'))

  it('parses at least one rule', () => {
    expect(rules.length).toBeGreaterThan(0)
  })

  it('has no two rules that set the same header on the same path', () => {
    const clashes = []
    for (const a of rules) {
      for (const b of rules) {
        if (a === b) continue
        const shared = a.headers.filter((h) => b.headers.includes(h))
        if (!shared.length) continue
        const re = toRegExp(b.pattern)
        for (const path of samplePaths(a.pattern)) {
          if (re.test(path)) clashes.push(`${path}: ${a.pattern} and ${b.pattern} both set ${shared.join(', ')}`)
        }
      }
    }
    expect(clashes).toEqual([])
  })

  it('catches the overlap #115 was about', () => {
    const old = parseRules('/css/*\n  Cache-Control: a\n/*\n  Cache-Control: b\n')
    const re = toRegExp(old[1].pattern)
    expect(samplePaths(old[0].pattern).some((p) => re.test(p))).toBe(true)
  })
})
