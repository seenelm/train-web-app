// src/setupTests.ts
import { test, expect } from '@playwright/test';
import { server } from '../src/common/mocks/server';

// Start MSW before all tests
test.beforeAll(() => server.listen());
// Reset handlers after each test (so tests don't affect each other)
test.afterEach(() => server.resetHandlers());
// Clean up after all tests are done
test.afterAll(() => server.close());