import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("User Feedback Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Submit website suggestion feedback successfully", async ({ page }) => {
    // Mock feedback endpoint
    await page.route("**/api/v1/feedback/submit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Feedback submitted successfully"
        })
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/dashboard/feedback");

    // Fill form
    await page.locator('select').selectOption("website");
    await page.locator('input[placeholder="Summary of issue or suggestion"]').fill("Great design features");
    await page.locator('textarea[placeholder="Write your feedback here (minimum 10 characters)..."]').fill("Frosted glass styling looks clean.");

    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Feedback submitted successfully")).toBeVisible();
  });

  test("Minimum subject length validation triggers alert", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/dashboard/feedback");
    
    // Fill too short subject
    await page.locator('input[placeholder="Summary of issue or suggestion"]').fill("ab");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=Subject must be at least 3 characters")).toBeVisible();
  });
});
