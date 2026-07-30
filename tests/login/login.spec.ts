import { test, expect } from "@playwright/test";

test.describe("Login Flow Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("1. renders email, password fields and sign in button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText("Sign in to Dashboard");
  });

  test("2. shows validation error on empty email submission", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Invalid email address")).toBeVisible();
  });

  test("3. shows validation error on empty password submission", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("user@binbuddy.com");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Password must be at least 6 characters long")).toBeVisible();
  });

  test("4. shows validation error on invalid email format", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("invalid-email");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Invalid email address")).toBeVisible();
  });

  test("5. shows validation error on short password", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("user@binbuddy.com");
    await page.locator('input[type="password"]').fill("123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Password must be at least 6 characters long")).toBeVisible();
  });

  test("6. displays error banner on incorrect credentials submission", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("wrong@gmail.com");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });

  test("7. successful login sets standard user session and loads dashboard", async ({ context, page }) => {
    await context.addCookies([
      { name: "auth_token", value: "mock-jwt-user-token", domain: "localhost", path: "/" },
      {
        name: "user_data",
        value: JSON.stringify({ id: "user-2", email: "user@binbuddy.com", role: "user", fullName: "Playwright Test User" }),
        domain: "localhost",
        path: "/",
      }
    ]);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("text=Playwright Test User")).toBeVisible();
  });

  test("8. successful login sets admin user session and loads dashboard", async ({ context, page }) => {
    await context.addCookies([
      { name: "auth_token", value: "mock-jwt-admin-token", domain: "localhost", path: "/" },
      {
        name: "user_data",
        value: JSON.stringify({ id: "admin-1", email: "admin@binbuddy.com", role: "admin", fullName: "Admin User" }),
        domain: "localhost",
        path: "/",
      }
    ]);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("text=Admin User")).toBeVisible();
  });

  test("9. toggles password text input visibility type", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[aria-label="Show password"]');
    await expect(passwordInput).toHaveAttribute("type", "password");
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("10. forgot password link redirects to recovery page", async ({ page }) => {
    await page.goto("/login");
    await page.locator("text=Forgot password?").click();
    await expect(page).toHaveURL(/\/forget-password/);
  });
});
