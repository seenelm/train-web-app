import { beforeAll, afterEach, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Start MSW before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close()); 