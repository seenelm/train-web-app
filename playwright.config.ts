import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // fullyParallel: true,
  // forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  // use: {
  //   baseURL: 'http://localhost:5173',
  //   trace: 'on-first-retry',
  // },
  // projects: [
  //   {
  //     name: "chromium",
  //     use: { ...devices["Desktop Chrome"] },
  //   },
  //   // Comment out other browsers for local development
  //   // {
  //   //   name: 'firefox',
  //   //   use: { ...devices['Desktop Firefox'] },
  //   // },
  //   // {
  //   //   name: 'webkit',
  //   //   use: { ...devices['Desktop Safari'] },
  //   // },
  // ],
  // use: {
  //   // Enable console logging
  //   launchOptions: {
  //     logger: {
  //       isEnabled: (name, severity) => true,
  //       log: (name, severity, message, args) =>
  //         console.log(`${name} ${message}`),
  //     },
  //   },
  //   // Log browser console
  //   trace: "on-first-retry",
  // },
  use: {
    baseURL: "http://localhost:5173",
  },
  outputDir: "test-results",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
