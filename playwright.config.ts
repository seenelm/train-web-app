import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true, 
  forbidOnly: !!process.env.CI, 
  retries: process.env.CI ? 2 : 0, 
  workers: process.env.CI ? 1 : undefined, 
  reporter: [["html"], ["list", { printSteps: true }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry", 
    screenshot: "on", 
    video: process.env.CI ? "on" : "on-first-retry", 
    actionTimeout: process.env.CI ? 30000 : 15000, 
    navigationTimeout: process.env.CI ? 45000 : 30000, 
  },
  outputDir: "test-results",
  timeout: process.env.CI ? 90000 : 60000, 
  expect: {
    timeout: process.env.CI ? 20000 : 10000, 
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120000, 
  },
});
