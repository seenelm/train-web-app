import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry", 
    screenshot: "on", 
    video: process.env.CI ? "on" : "on-first-retry", 
    actionTimeout: process.env.CI ? 45000 : 15000, 
    navigationTimeout: process.env.CI ? 60000 : 30000, 
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: process.env.CI ? 100 : 0,
    },
  },
  outputDir: "test-results",
  timeout: process.env.CI ? 120000 : 60000, 
  expect: {
    timeout: process.env.CI ? 30000 : 10000, 
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 180000, 
  },
});
