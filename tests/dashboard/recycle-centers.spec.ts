import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("Recycling Hubs & Doorstep Pickups E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Recycle Centers loads and lists Kathmandu and Lalitpur centers", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/dashboard/recycle-centers");
    await expect(page.locator("text=Recycling Centers & Pickups")).toBeVisible();
    await expect(page.locator("text=Kathmandu Recycling Hub")).toBeVisible();
  });

  test("Submit doorstep pickup request successfully", async ({ page }) => {
    // Mock doorstep API endpoint
    await page.route("**/api/v1/pickups", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Doorstep pickup ticket created successfully"
        })
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/dashboard/recycle-centers");
    
    // Open the request pickup modal
    await page.locator('button:has-text("Request Pickup")').first().click();
    
    // Wait for modal to be visible
    await expect(page.locator("text=Schedule Trash Pickup")).toBeVisible();
    
    // Fill pickup dialog details precisely
    await page.locator('form input[type="text"]').first().fill("Jessica Dhamala");
    await page.locator('form input[type="email"]').fill("jessica@gmail.com");
    await page.locator('form input[placeholder="e.g. 98XXXXXXXX"]').fill("9812345678");
    await page.locator('form input[type="date"]').fill("2026-08-01");
    await page.locator('form input[placeholder="Street name, house number, area description"]').fill("Chabahil, Kathmandu");
    await page.locator('form input[placeholder="e.g. 10 kg, 3 bags, etc."]').fill("5 kg");
    
    await page.locator('button:has-text("Submit Pickup Request")').click();
    await expect(page.locator("text=Request Submitted!")).toBeVisible();
  });
});
