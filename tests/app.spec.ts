import { test, expect } from "@playwright/test";

test.describe("BinBuddy General Application Tests", () => {
  test("Loads About Us page with smart waste sorting mission headers", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("text=Our Mission")).toBeVisible();
  });
});
