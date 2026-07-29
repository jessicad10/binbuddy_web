import { test, expect } from "@playwright/test";

test.describe("Protected Routes Guard", () => {
  test("Redirects unauthenticated user trying to load dashboard to login page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("Redirects standard user trying to load admin panel directly to dashboard", async ({ context, page }) => {
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
          id: "123",
          email: "jessica@gmail.com",
          role: "user",
          fullName: "Jessica Dhamala",
        }),
        domain: "localhost",
        path: "/",
      }
    ]);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
