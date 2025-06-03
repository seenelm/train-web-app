import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display login form', async ({ page }) => {
    // Verify the page title is displayed
    await expect(page.locator('h1')).toContainText('Welcome Back');
    
    // Check form elements using data-testid attributes
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="remember-checkbox"]')).toBeVisible();
    await expect(page.locator('[data-testid="forgot-password-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="google-button"]')).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Fill in the login form with invalid credentials
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Submit the form
    await page.click('[data-testid="login-button"]');
    
    // Check for error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Failed to sign in');
  });

  test('should show loading state during login', async ({ page }) => {
    // Fill in the login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Start watching for loading state before clicking
    const loginButtonPromise = page.waitForSelector('[data-testid="login-button"] .loading-spinner');
    
    // Submit the form
    await page.click('[data-testid="login-button"]');
    
    // Verify loading state appears
    await loginButtonPromise;
  });
}); 