import { Page, Locator, expect } from "@playwright/test";

export class SmartSortPage {
  readonly page: Page;
  readonly itemInput: Locator;
  readonly analyzeButton: Locator;
  readonly resultCard: Locator;
  readonly validationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemInput = page.locator('input[placeholder*="Enter a waste item"]');
    this.analyzeButton = page.locator('button:has-text("Sort My Waste")');
    this.resultCard = page.locator(".border, text=Classification Result");
    this.validationMessage = page.locator("text=Please enter a waste item name to sort");
  }

  async classify(item: string) {
    await this.itemInput.fill(item);
    await this.analyzeButton.click();
  }
}
