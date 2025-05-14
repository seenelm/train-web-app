// src/setupTests.ts
import { server } from '../src/mocks/server';

// Start MSW before all tests
beforeAll(() => server.listen());
// Reset handlers after each test (so tests don't affect each other)
afterEach(() => server.resetHandlers());
// Clean up after all tests are done
afterAll(() => server.close());