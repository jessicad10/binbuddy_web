import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("Navbar Navigation Links E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Navbar: navigate to Campaigns page successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    // Click link
    const campaignsLink = page.locator('nav a[href="/dashboard/campaigns"]');
    await expect(campaignsLink).toBeVisible();
    await campaignsLink.click();
    await expect(page).toHaveURL(/\/dashboard\/campaigns/);
  });

  test("Navbar: navigate to Notifications page successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    const notificationsLink = page.locator('nav a[href="/dashboard/notifications"]');
    await expect(notificationsLink).toBeVisible();
    await notificationsLink.click();
    await expect(page).toHaveURL(/\/dashboard\/notifications/);
  });
});
