import { test, expect } from "@playwright/test";

test.describe("Auth Context State Management", () => {
  test("Loads valid session data from cookies on mount", async ({ context, page }) => {
    // Mock whoami API endpoint
    await page.route("**/api/v1/auth/whoami", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "user-2",
            email: "playwright-test@test.com",
            role: "user",
            fullName: "Playwright Test User",
          }
        })
      });
    });

    await context.addCookies([
      {
        name: "auth_token",
        value: "mock-jwt-user-token",
        domain: "localhost",
        path: "/",
      },
      {
        name: "user_data",
        value: JSON.stringify({
          id: "user-2",
          email: "playwright-test@test.com",
          role: "user",
          fullName: "Playwright Test User",
        }),
        domain: "localhost",
        path: "/",
      }
    ]);

    await page.goto("/dashboard");
    await expect(page.locator("text=Playwright Test User")).toBeVisible();
  });

  test("Redirects to login when token cookie is missing on dashboard visit", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
