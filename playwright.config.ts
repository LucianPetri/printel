import { defineConfig, devices } from '@playwright/test';

const localPort = process.env.PLAYWRIGHT_PORT || '3001';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${localPort}`;
const webServerCommand =
  process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ||
  `PORT=${localPort} SHOP_URL=${baseURL} ADMIN_URL=${baseURL}/admin npm run dev`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  globalSetup: './tests/e2e/globalSetup.ts',
  webServer: {
    command: webServerCommand,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium'
      }
    }
  ]
});