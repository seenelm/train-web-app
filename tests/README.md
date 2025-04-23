# Testing Setup for Train Web App

This project uses Jest for unit/component testing and Playwright for end-to-end testing.

## Directory Structure

```
tests/
├── jest/             # Unit and component tests
│   ├── components/   # Tests for React components
│   └── setup.js      # Jest setup file
└── playwright/       # End-to-end tests
```

## Running Tests

### Jest Tests (Unit/Component)

```bash
# Run all Jest tests
npm test

# Run Jest tests in watch mode (for development)
npm run test:watch
```

### Playwright Tests (End-to-End)

```bash
# Run all Playwright tests
npm run test:e2e

# Run Playwright tests with UI mode
npm run test:e2e:ui

# Install Playwright browsers if needed
npx playwright install
```

## Writing Tests

### Jest Tests

Jest tests are located in the `tests/jest` directory. Component tests should be placed in the `tests/jest/components` directory.

Example component test:

```tsx
import { render, screen } from '@testing-library/react';
import React from 'react';
import MyComponent from '../../../src/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Playwright Tests

Playwright tests are located in the `tests/playwright` directory.

Example E2E test:

```ts
import { test, expect } from '@playwright/test';

test('user can navigate to about page', async ({ page }) => {
  // Start from the homepage
  await page.goto('/');
  
  // Click the "About" link
  await page.getByRole('link', { name: 'About' }).click();
  
  // Expect the URL to contain "about"
  await expect(page).toHaveURL(/about/);
  
  // Expect the page to have a specific heading
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
});
```

## Configuration Files

- `jest.config.js` - Configuration for Jest
- `playwright.config.ts` - Configuration for Playwright

## Best Practices

1. Keep tests focused and isolated
2. Use descriptive test names
3. Follow the AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies when necessary
5. Test user interactions, not implementation details
