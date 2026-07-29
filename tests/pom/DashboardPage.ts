import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly chatbotButton: Locator;
  readonly chatbotPanel: Locator;
  readonly chatInput: Locator;
  readonly sendChatButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.footer = page.locator("footer");
    this.chatbotButton = page.locator('button[title="Ask BinBuddy AI"]');
    this.chatbotPanel = page.locator("text=BinBuddy AI Helper, text=Smart Sustainability");
    this.chatInput = page.locator('input[placeholder*="Ask about"]');
    this.sendChatButton = this.chatbotPanel.locator("button[type='submit']");
  }

  async checkLayout() {
    await expect(this.header).toBeVisible();
    await expect(this.footer).toBeVisible();
    await expect(this.chatbotButton).toBeVisible();
  }

  async navigateTo(linkText: string) {
    const navLink = this.header.locator(`text=${linkText}`);
    await navLink.click();
  }

  async openChatbot() {
    await this.chatbotButton.click();
    await expect(this.chatbotPanel).toBeVisible();
  }

  async askChatbot(question: string) {
    await this.chatInput.fill(question);
    await this.sendChatButton.click();
  }
}
