// Dev-only linter for CSP-Alpine expression hazards.
//
// Loaded by layouts/partials/head/js.html ONLY when hugo.Environment ==
// "development". It must never reach a production build.
//
// WHY THIS EXISTS
//
// The theme bundles @alpinejs/csp. Its evaluator does not run inline
// expressions through `new Function()` — it parses them with its own small
// parser and resolves every identifier against the Alpine component scope.
// Anything it cannot resolve does not work, and historically it did not even
// complain: three separate silent production outages (six PostHog click
// events, a contact form, an email signup) came from inline handlers that
// rendered fine, logged nothing, and never fired.
//
// WHAT ACTUALLY BREAKS, in the version this theme pins
//
//   1. Arrow functions. The parser rejects `() => …` outright.
//   2. Any identifier that is not in the component's Alpine scope — which
//      includes every browser global. `@click="posthog.capture('x')"`,
//      `@click="window.foo()"` and `@click="fetch(…)"` all fail, because
//      `posthog`, `window` and `fetch` are globals, not component state.
//
// What does NOT break, and is therefore NOT flagged: calling a method that
// lives on the component, e.g. `@click="dismiss()"` or
// `x-show="!isValidAsin(asin)"`. The theme's own partials rely on this.
//
// That last point is why this linter resolves identifiers against the live
// Alpine scope instead of just warning on any expression containing "(" or
// "=>". A blanket paren check fires on roughly a dozen correct expressions in
// this theme's own templates, and a linter that cries wolf on shipped working
// code gets tuned out — which is exactly how the three outages stayed
// invisible.

const FIX = 'Move the logic into an Alpine.data() component (see assets/js/main.js, '
  + 'e.g. ryderTrack / ryderForm) and reference it by name, passing anything it '
  + 'needs via data-* attributes. See the README, "CSP-Safe Alpine".'

// Alpine magics are always resolvable, whatever the component scope holds.
const MAGICS = new Set([
  '$el', '$refs', '$store', '$watch', '$dispatch', '$nextTick', '$root',
  '$data', '$id', '$event',
])

// Word-shaped tokens that are language, not identifiers to resolve.
const KEYWORDS = new Set([
  'true', 'false', 'null', 'undefined', 'in', 'of', 'new', 'typeof', 'void',
  'delete', 'instanceof', 'await', 'return', 'if', 'else', 'this',
])

// Directives that carry no Alpine expression at all — x-transition's value is
// a list of CSS classes, x-ref/x-teleport/x-id take plain strings.
const NON_EXPRESSION = /^(x-transition|x-ref|x-cloak|x-teleport|x-id|x-mask)/

// Directives whose identifiers are deliberately not in the element's own data
// stack: x-data names an Alpine.data() registration, x-for introduces its own
// loop variable. Both still get the arrow-function check.
const SCOPE_EXEMPT = /^(x-data|x-for)$/

const EXPRESSION_DIRECTIVE = /^(x-show|x-text|x-html|x-model|x-effect|x-init|x-if|x-for|x-data|x-modelable|x-on:|x-bind:|@|:)/

/** A short, human-findable label for an element. */
function describe(el) {
  if (el.id) return `#${el.id}`
  const tag = el.tagName.toLowerCase()
  const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3)
  const label = cls.length ? `${tag}.${cls.join('.')}` : tag
  const html = el.outerHTML.slice(0, 160).replace(/\s+/g, ' ')
  return `${label} — ${html}${el.outerHTML.length > 160 ? '…' : ''}`
}

/** Merge every Alpine scope visible to this element, nearest first. */
function scopesFor(el) {
  const scopes = []
  let node = el
  while (node) {
    if (node._x_dataStack) scopes.push(...node._x_dataStack)
    node = node.parentElement
  }
  return scopes
}

function resolvable(name, scopes) {
  if (MAGICS.has(name) || KEYWORDS.has(name)) return true
  for (const scope of scopes) {
    try {
      if (name in scope) return true
    } catch (e) {
      // A reactive proxy that objects to `in` is not evidence of anything.
      return true
    }
  }
  return false
}

/**
 * Identifiers an expression resolves against its own scope: string literals
 * and property names after a dot are removed first, so `a.b` yields only `a`
 * and `posthog.capture('x')` yields only `posthog`.
 */
function rootIdentifiers(expression) {
  const stripped = expression
    .replace(/'[^']*'|"[^"]*"|`[^`]*`/g, ' ')  // string literals
    .replace(/\?\./g, '.')
    .replace(/\.\s*[A-Za-z_$][\w$]*/g, ' ')    // property accesses
    .replace(/\{[^}]*:/g, '{')                 // object-literal keys
  const found = stripped.match(/[$A-Za-z_][\w$]*/g) || []
  return [...new Set(found)]
}

function lintElement(el, warn) {
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name
    if (!EXPRESSION_DIRECTIVE.test(name)) continue
    if (NON_EXPRESSION.test(name)) continue

    const expression = (attr.value || '').trim()
    if (!expression) continue

    if (expression.includes('=>')) {
      warn(
        `[ryder:csp-lint] Arrow function in "${name}" — the CSP-Alpine parser rejects it, `
        + `so this directive never runs.\n  ${expression}\n  on ${describe(el)}\n  ${FIX}`,
      )
      continue
    }

    const base = name.replace(/[.:].*$/, '')
    if (SCOPE_EXEMPT.test(base) || SCOPE_EXEMPT.test(name)) continue

    const scopes = scopesFor(el)
    // No Alpine scope at all means no x-data ancestor; Alpine would not
    // evaluate this anyway, and warning about it would be noise.
    if (!scopes.length) continue

    for (const ident of rootIdentifiers(expression)) {
      if (resolvable(ident, scopes)) continue
      const isGlobal = ident in window
      warn(
        `[ryder:csp-lint] "${name}" refers to \`${ident}\`, which is not in the Alpine `
        + `component scope${isGlobal ? ' (it is a browser global — CSP-Alpine cannot reach globals)' : ''}. `
        + `The CSP evaluator cannot resolve it, so this directive does not work.\n`
        + `  ${expression}\n  on ${describe(el)}\n  ${FIX}`,
      )
    }
  }
}

export function runCspLint(root = document) {
  let count = 0
  const warn = (message) => { count += 1; console.warn(message) }

  let elements
  try {
    elements = root.querySelectorAll('*')
  } catch (e) {
    return 0
  }

  elements.forEach((el) => {
    if (!el.attributes || !el.attributes.length) return
    try {
      lintElement(el, warn)
    } catch (e) {
      // The linter is an advisory. It must never break the page it is auditing.
      console.warn('[ryder:csp-lint] linter error on', el, e)
    }
  })

  if (count) {
    console.warn(
      `[ryder:csp-lint] ${count} CSP-Alpine issue${count === 1 ? '' : 's'} found. `
      + 'These directives silently do nothing. This check is development-only.',
    )
  }
  return count
}

// Run once Alpine has built its data stacks, since the scope check reads them.
if (typeof window !== 'undefined') {
  // Exposed so you can re-run it from the console after rendering content
  // dynamically: `__ryderCspLint()`, or `__ryderCspLint(someSubtree)`.
  window.__ryderCspLint = runCspLint

  const start = () => setTimeout(() => runCspLint(), 0)
  if (window.Alpine && window.Alpine.version) {
    start()
  } else {
    document.addEventListener('alpine:initialized', start, { once: true })
  }
}
