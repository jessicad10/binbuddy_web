import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("Smart Sort Sandbox API", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Classify banana peel as organic waste", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/dashboard/smart-sort");
    
    // Fill and submit
    await page.locator('input[placeholder="Enter a waste item, e.g. banana peel or Coke bottle..."]').fill("Banana Peel");
    await page.locator('button:has-text("Classify Waste")').click();

    // Check result card elements
    await expect(page.locator("text=Banana Peel")).toBeVisible();
    await expect(page.locator("text=ORGANIC")).toBeVisible();
  });

  test("Classify Coke bottle as recyclable waste", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    await page.goto("/dashboard/smart-sort");
    
    await page.locator('input[placeholder="Enter a waste item, e.g. banana peel or Coke bottle..."]').fill("Coke plastic bottle");
    await page.locator('button:has-text("Classify Waste")').click();

    await expect(page.locator("text=Coke plastic bottle")).toBeVisible();
    await expect(page.locator("text=RECYCLABLE")).toBeVisible();
  });
});
