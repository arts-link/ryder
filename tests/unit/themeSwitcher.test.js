import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { initDarkMode } from '../../assets/js/themeSwitcher.js'

// matchMedia isn't implemented in jsdom — provide a controllable mock.
function mockMatchMedia(prefersDark = false) {
  const listeners = []
  const mq = {
    matches: prefersDark,
    addEventListener: vi.fn((_, fn) => listeners.push(fn)),
    removeEventListener: vi.fn((_, fn) => {
      const i = listeners.indexOf(fn)
      if (i !== -1) listeners.splice(i, 1)
    }),
    // Helper to simulate an OS preference change in tests
    _fire(matches) {
      listeners.forEach(fn => fn({ matches }))
    },
  }
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue(mq),
  })
  return mq
}

function createButtons() {
  document.body.innerHTML = `
    <button id="lightMode"></button>
    <button id="darkMode"></button>
    <button id="systemMode"></button>
  `
}

beforeEach(() => {
  createButtons()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

// ---------------------------------------------------------------------------
// Initialisation — restoring saved preference
// ---------------------------------------------------------------------------

describe('initDarkMode — initialisation', () => {
  it('defaults to system mode when no localStorage preference is set', () => {
    mockMatchMedia(false)
    initDarkMode()

    expect(document.getElementById('systemMode').classList.contains('hidden')).toBe(false)
    expect(document.getElementById('lightMode').classList.contains('hidden')).toBe(true)
    expect(document.getElementById('darkMode').classList.contains('hidden')).toBe(true)
  })

  it('restores dark mode from localStorage', () => {
    mockMatchMedia(false)
    localStorage.theme = 'dark'
    initDarkMode()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.getElementById('darkMode').classList.contains('hidden')).toBe(false)
  })

  it('restores light mode from localStorage', () => {
    mockMatchMedia(false)
    localStorage.theme = 'light'
    initDarkMode()

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.getElementById('lightMode').classList.contains('hidden')).toBe(false)
  })

  it('applies dark class in system mode when OS prefers dark', () => {
    mockMatchMedia(true) // OS = dark
    initDarkMode()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.getElementById('systemMode').classList.contains('hidden')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Button cycling
// ---------------------------------------------------------------------------

describe('initDarkMode — button cycling', () => {
  it('clicking #lightMode (sun) cycles to dark', () => {
    mockMatchMedia(false)
    initDarkMode()

    // Start in system mode, click light-mode button to go dark
    document.getElementById('lightMode').classList.remove('hidden')
    document.getElementById('lightMode').click()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.theme).toBe('dark')
  })

  it('clicking #darkMode (moon) cycles to system', () => {
    mockMatchMedia(false)
    localStorage.theme = 'dark'
    initDarkMode()

    document.getElementById('darkMode').click()

    expect(localStorage.theme).toBe('')
    expect(document.getElementById('systemMode').classList.contains('hidden')).toBe(false)
  })

  it('clicking #systemMode (computer) cycles to light', () => {
    mockMatchMedia(false)
    initDarkMode()

    document.getElementById('systemMode').click()

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.theme).toBe('light')
    expect(document.getElementById('lightMode').classList.contains('hidden')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Button visibility invariants
// ---------------------------------------------------------------------------

describe('initDarkMode — button visibility', () => {
  it('only darkMode button is visible in dark mode', () => {
    mockMatchMedia(false)
    localStorage.theme = 'dark'
    initDarkMode()

    expect(document.getElementById('darkMode').classList.contains('hidden')).toBe(false)
    expect(document.getElementById('lightMode').classList.contains('hidden')).toBe(true)
    expect(document.getElementById('systemMode').classList.contains('hidden')).toBe(true)
  })

  it('only lightMode button is visible in light mode', () => {
    mockMatchMedia(false)
    localStorage.theme = 'light'
    initDarkMode()

    expect(document.getElementById('lightMode').classList.contains('hidden')).toBe(false)
    expect(document.getElementById('darkMode').classList.contains('hidden')).toBe(true)
    expect(document.getElementById('systemMode').classList.contains('hidden')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// OS preference detection
// ---------------------------------------------------------------------------

describe('initDarkMode — OS preference change', () => {
  it('updates dark class when OS preference changes in system mode', () => {
    const mq = mockMatchMedia(false) // OS = light initially
    initDarkMode() // defaults to system

    // Simulate OS switching to dark
    mq._fire(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Simulate OS switching back to light
    mq._fire(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('ignores OS preference changes when an explicit theme is set', () => {
    const mq = mockMatchMedia(false)
    localStorage.theme = 'light'
    initDarkMode()

    // OS says go dark — should be ignored because user chose light explicitly
    mq._fire(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
