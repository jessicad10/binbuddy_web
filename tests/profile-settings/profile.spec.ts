import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("Profile and Settings Configuration", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Loads current profile parameters into fields successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/profile");
    await expect(page.locator("text=Profile Settings")).toBeVisible();

    const fullNameInput = page.locator('input[placeholder="John Doe"]');
    await expect(fullNameInput).toHaveValue("Playwright Test User");
  });
});
