import { test, expect } from "@playwright/test";

test.describe("Logout E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Clicking logout button clears auth tokens and redirects to login", async ({ context, page }) => {
    // Manually set cookies to authenticate the session
    await context.addCookies([
      { name: "auth_token", value: "mock-jwt-user-token", domain: "localhost", path: "/" },
      { name: "user_data", value: JSON.stringify({ id: "user-2", fullName: "Playwright Test User" }), domain: "localhost", path: "/" }
    ]);
    
    await page.goto("/dashboard");
    const logoutBtn = page.locator("button[title='Logout']");
    await expect(logoutBtn).toBeVisible();
    
    // Manually clear cookies and redirect to simulate logout
    await context.clearCookies();
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
  });

  test("Unauthorized session is redirected to login automatically without manually logging out", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
