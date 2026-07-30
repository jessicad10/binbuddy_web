import { test, expect } from "@playwright/test";

test.describe("Registration Flow Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("1. renders registration form fields and submit button", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[placeholder="Jessica"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Dhamala"]')).toBeVisible();
    await expect(page.locator('input[placeholder="jessica123"]')).toBeVisible();
    await expect(page.locator('input[placeholder="xyz@gmail.com"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText("Create BinBuddy Account");
  });

  test("2. shows validation error on empty fields submission", async ({ page }) => {
    await page.goto("/register");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=First name must be at least 2 characters long").first()).toBeVisible();
  });

  test("3. shows validation error if passwords do not match", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Jessica"]').fill("Jessica");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="jessica123"]').fill("jessicad");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('input[name="confirmPassword"]').fill("mismatch123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Passwords do not match")).toBeVisible();
  });

  test("4. shows validation error if password is less than 6 characters", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Jessica"]').fill("Jessica");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="jessica123"]').fill("jessicad");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("123");
    await page.locator('input[name="confirmPassword"]').fill("123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Password must be at least 6 characters long").first()).toBeVisible();
  });

  test("5. shows validation error if username is less than 3 characters", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Jessica"]').fill("Jessica");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="jessica123"]').fill("jd");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('input[name="confirmPassword"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Username must be at least 3 characters long")).toBeVisible();
  });

  test("6. shows validation error if email format is invalid", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Jessica"]').fill("Jessica");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="jessica123"]').fill("jessicad");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("invalid-email");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('input[name="confirmPassword"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Invalid email address")).toBeVisible();
  });

  test("7. triggers Zod validation when missing last name", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Jessica"]').fill("Jessica");
    await page.locator('input[placeholder="jessica123"]').fill("jessicad");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('input[name="confirmPassword"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Last name must be at least 2 characters long")).toBeVisible();
  });

  test("8. triggers Zod validation when missing first name", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="Dhamala"]').fill("Dhamala");
    await page.locator('input[placeholder="jessica123"]').fill("jessicad");
    await page.locator('input[placeholder="xyz@gmail.com"]').fill("jessica@gmail.com");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('input[name="confirmPassword"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=First name must be at least 2 characters long")).toBeVisible();
  });

  test("9. brand logo header redirects to login", async ({ page }) => {
    await page.goto("/register");
    await page.locator("text=BinBuddy").first().click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("10. sign in link redirects back to login page", async ({ page }) => {
    await page.goto("/register");
    await page.locator("text=Sign in here").click();
    await expect(page).toHaveURL(/\/login/);
  });
});
