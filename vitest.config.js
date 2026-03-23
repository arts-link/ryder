import { defineConfig } from 'vitest/config'

export default defineConfig({
  css: { postcss: { plugins: [] } }, // override root postcss.config.js — autoprefixer is in exampleSite only
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.js'],
  },
})
