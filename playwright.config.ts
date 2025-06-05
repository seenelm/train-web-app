import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // Run tests sequentially in CI
  forbidOnly: !!process.env.CI, // Fail if tests are marked with .only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Use a single worker in CI
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry", // Capture trace on first retry of each test
    screenshot: "only-on-failure", // Capture screenshots only on failure
    video: "on-first-retry", // Record video only on first retry
    actionTimeout: 15000, // Timeout for actions like click, fill
    navigationTimeout: 30000, // Timeout for navigations
  },
  outputDir: "test-results",
  timeout: 60000, // Increase overall test timeout to 60 seconds
  expect: {
    timeout: 10000, // Increase expect assertion timeout to 10 seconds
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 60000, // Increase server startup timeout
  },
});
