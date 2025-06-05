import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should register, logout and login a new user", async ({ page }) => {
    // Enable console logging
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));

    const testUser = {
      email: "newuser@example.com",
      password: "Password123!",
      name: "New User",
    };

    // Step 1: Navigate to registration page
    await page.goto("/register");
    await expect(page).toHaveURL("/register");

    // Step 2: Fill registration form
    await page.getByTestId("name-input").fill(testUser.name);
    await page.getByTestId("email-input").fill(testUser.email);
    await page.getByTestId("password-input").fill(testUser.password);
    await page.getByTestId("confirm-password-input").fill(testUser.password);

    await page
      .locator("label")
      .filter({ hasText: "I agree to the Terms of" })
      .locator("span")
      .first()
      .check();

    // Step 3: Submit registration form
    await page.getByTestId("register-button").click();

    // Step 4: Verify successful registration
    await expect(page).toHaveURL("/");

    // Step 5: Logout
    await page.locator(".sidebar-signout .tab-icon").click();
    await expect(page).toHaveURL("/login");

    // Step 5: Fill login form
    await page.getByTestId("email-input").fill(testUser.email);
    await page.getByTestId("password-input").fill(testUser.password);
    await page.locator("span").nth(2).check();

    // Step 6: Submit login form
    await page.getByTestId("login-button").click();
    // Verify successful login
    await expect(page).toHaveURL("/");
  });

  test("should reset password successfully", async ({ page }) => {
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));

    const testUser = {
      email: "test@example.com",
      newPassword: "NewPassword123!",
      resetCode: "123456",
    };

    // Step 1: Navigate to forgot password page
    await page.goto("/forgot-password");
    await expect(page).toHaveURL("/forgot-password");

    // Step 2: Request password reset
    await page.getByTestId("email-input").fill(testUser.email);
    await page.getByTestId("submit-button").click();

    // Step 3: Verify navigation to reset password page
    await expect(page).toHaveURL(
      `/reset-password?email=${encodeURIComponent(testUser.email)}`
    );

    // Step 4: Fill reset password form
    await page.getByTestId("email-input").fill(testUser.email);
    await page.getByTestId("code-input").fill(testUser.resetCode);
    await page.getByTestId("password-input").fill(testUser.newPassword);
    await page.getByTestId("confirm-password-input").fill(testUser.newPassword);

    // // Step 5: Submit reset password form
    await page.getByTestId("reset-button").click();

    // Step 7: Verify navigation to login page
    await expect(page).toHaveURL("/login");

    // Step 8: Verify can login with new password
    await page.getByTestId("email-input").fill(testUser.email);
    await page.getByTestId("password-input").fill(testUser.newPassword);
    await page.locator("span").nth(2).check();
    await page.getByTestId("login-button").click();

    // Step 9: Verify successful login
    await expect(page).toHaveURL("/");
  });
});
