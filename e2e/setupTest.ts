// src/setupTests.ts
import { test, expect } from "@playwright/test";
import { worker } from "../src/mocks/browser";

// Start MSW before all tests
test.beforeAll(async () => {
  // Start the MSW worker
  await worker.start();

  // Log all requests
  worker.events.on("request:start", ({ request }) => {
    console.log("MSW intercepted request:", {
      method: request.method,
      url: request.url,
      headers: request.headers,
    });
  });
});
// Reset handlers after each test (so tests don't affect each other)
test.afterEach(() => worker.resetHandlers());
// Clean up after all tests are done
test.afterAll(() => worker.stop());
