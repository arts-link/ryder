import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:1313',
  },
  webServer: {
    command: 'hugo server -D --source exampleSite',
    url: 'http://localhost:1313/ryder/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
