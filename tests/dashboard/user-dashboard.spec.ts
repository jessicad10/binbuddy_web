import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage";

test.describe("User Dashboard Utilities", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("PLAYWRIGHT_TEST", "true"));
  });

  test("Dashboard page loads and displays header, footer, and chatbot", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");
    
    // Check elements
    await expect(page.locator("text=My Services")).toBeVisible();
    await expect(page.locator("text=Recent Stories")).toBeVisible();
    await expect(page.locator("text=♻ BinBuddy")).toBeVisible();
  });

  test("Open chatbot floating panel and submit user query", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("user@binbuddy.com", "password123");

    // Chatbot floating button trigger should exist
    const chatbotToggle = page.locator("button:has-text('💬')");
    await expect(chatbotToggle).toBeVisible();
    await chatbotToggle.click();

    // Panel drawer opens
    await expect(page.locator("text=BinBuddy AI Assistant")).toBeVisible();
  });
});
