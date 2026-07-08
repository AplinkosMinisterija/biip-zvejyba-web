import { defineConfig, devices } from '@playwright/test';

// E2E tests run the frontend from THIS branch (Vite dev server started below)
// against a real backend. /api requests are proxied to VITE_PROXY_URL
// (vite.config.ts), so the tests exercise the same code path as production.
const BASE_URL = 'http://localhost:5173';
const API_PROXY_URL = process.env.VITE_PROXY_URL || 'https://staging-zvejyba.biip.lt/api';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'yarn start',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_PROXY_URL: API_PROXY_URL,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
