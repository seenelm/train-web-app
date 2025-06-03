import { test, expect } from '@playwright/test';

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
  });

  test('should display forgot password form', async ({ page }) => {
    // Verify the page title is displayed
    await expect(page.locator('h1')).toContainText('Forgot Password');
    
    // Check form elements using data-testid attributes
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
    
    // Verify the form description is displayed
    await expect(page.locator('.form-description')).toContainText('Enter your email address');
  });

  test('should require email to be entered', async ({ page }) => {
    // Try to submit the form without entering an email
    await page.click('[data-testid="submit-button"]');
    
    // Check that the form validation prevents submission
    // HTML5 validation will show a browser validation message
    // We can check if we're still on the same page
    await expect(page).toHaveURL(/.*\/forgot-password/);
  });

//   test('should show loading state during submission', async ({ page }) => {
//     // Fill in the form with a valid email
//     await page.fill('[data-testid="email-input"]', 'test@example.com');
    
//     // Start watching for loading state before clicking
//     const submitButtonPromise = page.waitForSelector('[data-testid="submit-button"] .loading-spinner');
    
//     // Submit the form
//     await page.click('[data-testid="submit-button"]');
    
//     // Verify loading state appears
//     await submitButtonPromise;
//   });

//   test('should navigate to reset password page after submission', async ({ page }) => {
//     // Fill in the form with a valid email
//     const testEmail = 'test@example.com';
//     await page.fill('[data-testid="email-input"]', testEmail);
    
//     // Submit the form and wait for navigation
//     await Promise.all([
//       page.waitForNavigation(),
//       page.click('[data-testid="submit-button"]')
//     ]);
    
//     // Verify we've been redirected to the reset password page with the email in the URL
//     await expect(page).toHaveURL(/.*\/reset-password\?email=test%40example\.com/);
//   });
});

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

//   test('should display login form', async ({ page }) => {
//     // Verify the page title is displayed
//     await expect(page.locator('h1')).toContainText('Welcome Back');
    
//     // Check form elements using data-testid attributes
//     await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
//     await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
//     await expect(page.locator('[data-testid="remember-checkbox"]')).toBeVisible();
//     await expect(page.locator('[data-testid="forgot-password-link"]')).toBeVisible();
//     await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
//     await expect(page.locator('[data-testid="google-button"]')).toBeVisible();
//   });

//   test('should show error message with invalid credentials', async ({ page }) => {
//     // Fill in the login form with invalid credentials
//     await page.fill('[data-testid="email-input"]', 'test@example.com');
//     await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
//     // Submit the form
//     await page.click('[data-testid="login-button"]');
    
//     // Check for error message
//     await expect(page.locator('.error-message')).toBeVisible();
//     await expect(page.locator('.error-message')).toContainText('Failed to sign in');
//   });

//   test('should show loading state during login', async ({ page }) => {
//     // Fill in the login form
//     await page.fill('[data-testid="email-input"]', 'test@example.com');
//     await page.fill('[data-testid="password-input"]', 'password123');
    
//     // Start watching for loading state before clicking
//     const loginButtonPromise = page.waitForSelector('[data-testid="login-button"] .loading-spinner');
    
//     // Submit the form
//     await page.click('[data-testid="login-button"]');
    
//     // Verify loading state appears
//     await loginButtonPromise;
//   });
}); 

test.describe('Navigation', () => {
    test('should navigate to privacy page', async ({ page }) => {
      await page.goto('/privacy');
      await page.waitForLoadState('networkidle');
      
      // Verify URL and page content
      await expect(page).toHaveURL(/.*\/privacy/);
      await expect(page.locator('h1')).toContainText('Privacy Policy');
    });
    
    test('should navigate to terms of service page', async ({ page }) => {
      await page.goto('/terms-of-service');
      await page.waitForLoadState('networkidle');
      
      // Verify URL and page content
      await expect(page).toHaveURL(/.*\/terms-of-service/);
      await expect(page.locator('h1')).toContainText('Terms of Service');
    });
    
    test('should navigate to login page', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Verify URL and page content
      await expect(page).toHaveURL(/.*\/login/);
      await expect(page.locator('h1')).toContainText('Welcome Back');
      
      // Verify login form elements are visible
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    });
    
    test('should navigate to registration page', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      
      // Verify URL and page content
      await expect(page).toHaveURL(/.*\/register/);
      await expect(page.locator('h1')).toContainText('Create Account');
    });
    
    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/forgot-password');
      await page.waitForLoadState('networkidle');
      
      // Verify URL and page content
      await expect(page).toHaveURL(/.*\/forgot-password/);
      await expect(page.locator('h1')).toContainText('Forgot Password');
    });
  });

  test.describe('Registration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
    });
  
    // test('should display registration form', async ({ page }) => {
    //   // Verify the page title is displayed
    //   await expect(page.locator('h1')).toContainText('Create Account');
      
    //   // Check form elements using data-testid attributes
    //   await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    //   await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    //   await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    //   await expect(page.locator('[data-testid="confirm-password-input"]')).toBeVisible();
    //   await expect(page.locator('[data-testid="terms-checkbox"]')).toBeVisible();
    //   await expect(page.locator('[data-testid="register-button"]')).toBeVisible();
    //   await expect(page.locator('[data-testid="google-button"]')).toBeVisible();
    // });
  
    // test('should show password mismatch error', async ({ page }) => {
    //   // Fill in the registration form with mismatched passwords
    //   await page.fill('[data-testid="name-input"]', 'Test User');
    //   await page.fill('[data-testid="email-input"]', 'test@example.com');
    //   await page.fill('[data-testid="password-input"]', 'password123');
    //   await page.fill('[data-testid="confirm-password-input"]', 'password456');
    //   await page.check('[data-testid="terms-checkbox"]');
      
    //   // Submit the form
    //   await page.click('[data-testid="register-button"]');
      
    //   // Check for password mismatch error
    //   await expect(page.locator('.password-error')).toBeVisible();
    //   await expect(page.locator('.password-error')).toContainText('Passwords do not match');
    // });
  
    // test('should show terms acceptance error', async ({ page }) => {
    //   // Fill in the registration form without accepting terms
    //   await page.fill('[data-testid="name-input"]', 'Test User');
    //   await page.fill('[data-testid="email-input"]', 'test@example.com');
    //   await page.fill('[data-testid="password-input"]', 'password123');
    //   await page.fill('[data-testid="confirm-password-input"]', 'password123');
    //   // Do not check the terms checkbox
      
    //   // Submit the form
    //   await page.click('[data-testid="register-button"]');
      
    //   // Check for terms acceptance error
    //   await expect(page.locator('.terms-error')).toBeVisible();
    //   await expect(page.locator('.terms-error')).toContainText('You must accept the terms');
    // });
  
    // test('should show loading state during registration', async ({ page }) => {
    //   // Fill in the registration form correctly
    //   await page.fill('[data-testid="name-input"]', 'Test User');
    //   await page.fill('[data-testid="email-input"]', 'test@example.com');
    //   await page.fill('[data-testid="password-input"]', 'password123');
    //   await page.fill('[data-testid="confirm-password-input"]', 'password123');
    //   await page.check('[data-testid="terms-checkbox"]');
      
    //   // Start watching for loading state before clicking
    //   const registerButtonPromise = page.waitForSelector('[data-testid="register-button"] .loading-spinner');
      
    //   // Submit the form
    //   await page.click('[data-testid="register-button"]');
      
    //   // Verify loading state appears
    //   await registerButtonPromise;
    // });
  });
  