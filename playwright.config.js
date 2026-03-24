import { defineConfig } from '@playwright/test'

const HUGO_PORT = process.env.PLAYWRIGHT_HUGO_PORT || '1314'
const BASE_URL = `http://127.0.0.1:${HUGO_PORT}`

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: BASE_URL,
  },
  webServer: {
    command: `hugo server -D --source exampleSite --bind 127.0.0.1 --port ${HUGO_PORT} --baseURL ${BASE_URL}/ryder/`,
    url: `${BASE_URL}/ryder/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
