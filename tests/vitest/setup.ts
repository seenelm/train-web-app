import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Set up global mocks for assets
vi.mock('**/*.svg', () => ({
  default: 'mocked-svg-path'
}));

// Clean up after each test
afterEach(() => {
  cleanup();
});
