import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("Login E2E Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Successful Admin Login redirects to dashboard page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("admin@binbuddy.com", "password123");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("Invalid credentials displays error alert banner", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("wrong@gmail.com", "wrongpassword");
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });
});
