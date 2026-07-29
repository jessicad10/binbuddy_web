import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("Forgot Password E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Navigates to forget-password page and submits request successfully", async ({ page }) => {
    // Mock forgot password endpoint
    await page.route("**/api/v1/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Reset email sent successfully"
        })
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/\/forget-password/);

    const emailInput = page.locator('input[type="email"]');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill("admin@binbuddy.com");
    await submitBtn.click();
    await expect(page.locator("text=Check Your Email")).toBeVisible();
  });

  test("Submitting with empty email displays validation requirement", async ({ page }) => {
    await page.goto("/forget-password");
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    const emailInput = page.locator('input[type="email"]');
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(validity).toBeFalsy();
  });
});
