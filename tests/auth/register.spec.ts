import { test, expect } from "@playwright/test";

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Loads register form and submits successfully", async ({ page }) => {
    // Mock registration API
    await page.route("**/api/v1/auth/register", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "User registered successfully"
        })
      });
    });

    await page.goto("/register");
    await page.locator('input[placeholder="Jessica"]').fill("Jessica");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="jessica123"]').fill("jessicad");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("userpassword123");
    await page.locator('input[name="confirmPassword"]').fill("userpassword123");
    
    // Submit registration
    await page.locator('button[type="submit"]').click();
    
    // Confirms redirect back to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("Missing first name triggers validation error message", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("userpassword123");
    await page.locator('input[name="confirmPassword"]').fill("userpassword123");
    await page.locator('button[type="submit"]').click();

    // Check Zod validation message
    await expect(page.locator("text=First name must be at least 2 characters long")).toBeVisible();
  });
});
