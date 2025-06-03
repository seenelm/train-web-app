import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Add explicit timeouts
  timeout: process.env.CI ? 60000 : 30000, // 60 seconds on CI, 30 seconds locally
  expect: {
    timeout: process.env.CI ? 10000 : 5000, // 10 seconds on CI, 5 seconds locally
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // Add navigation timeout
    navigationTimeout: process.env.CI ? 30000 : 15000,
    // Add action timeout
    actionTimeout: process.env.CI ? 15000 : 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Comment out other browsers for local development
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start the server
  },
});