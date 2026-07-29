import { test, expect } from "@playwright/test";

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
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
