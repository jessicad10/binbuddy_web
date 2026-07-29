import { Page, Locator, expect } from "@playwright/test";

export class RecycleCentersPage {
  readonly page: Page;
  readonly centerCard: Locator;
  readonly requestPickupButton: Locator;
  readonly pickupForm: Locator;
  
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly wasteDropdown: Locator;
  readonly quantityInput: Locator;
  readonly dateInput: Locator;
  readonly submitButton: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.centerCard = page.locator("article", { hasText: "Kathmandu Recycling Hub" }).first();
    this.requestPickupButton = this.centerCard.locator('button:has-text("Request Pickup")');
    this.pickupForm = page.locator("form, text=Schedule Trash Pickup");
    
    this.nameInput = page.locator('input[required]').nth(0);
    this.emailInput = page.locator('input[type="email"]');
    this.phoneInput = page.locator('input[type="tel"]');
    this.addressInput = page.locator('input[placeholder*="Street name"]');
    this.wasteDropdown = page.locator("select");
    this.quantityInput = page.locator('input[placeholder*="e.g. 10 kg"]');
    this.dateInput = page.locator('input[type="date"]');
    this.submitButton = page.locator('form button[type="submit"]');
    this.successBanner = page.locator("text=Request Submitted");
  }

  async openPickupForm() {
    await this.requestPickupButton.click();
    await expect(this.pickupForm).toBeVisible();
  }

  async submitPickupRequest(details: {
    phone: string;
    address: string;
    wasteType: string;
    quantity: string;
    date: string;
  }) {
    await this.phoneInput.fill(details.phone);
    await this.addressInput.fill(details.address);
    await this.wasteDropdown.selectOption(details.wasteType);
    await this.quantityInput.fill(details.quantity);
    await this.dateInput.fill(details.date);
    await this.submitButton.click();
  }
}
