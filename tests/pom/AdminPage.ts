import { Page, Locator, expect } from "@playwright/test";

export class AdminPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly usersTab: Locator;
  readonly pickupsTab: Locator;
  readonly centersTab: Locator;
  
  readonly addCenterButton: Locator;
  readonly centerNameInput: Locator;
  readonly centerCityInput: Locator;
  readonly centerAddressInput: Locator;
  readonly centerPhoneInput: Locator;
  readonly centerEmailInput: Locator;
  readonly centerHoursInput: Locator;
  readonly centerDescInput: Locator;
  readonly centerSubmitButton: Locator;

  readonly searchInput: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator("aside, nav");
    this.usersTab = page.locator('button:has-text("Manage Users")');
    this.pickupsTab = page.locator('button:has-text("Manage Pickups")');
    this.centersTab = page.locator('button:has-text("Manage Centers")');
    
    this.addCenterButton = page.locator('button:has-text("Add New Center")');
    this.centerNameInput = page.locator('input[required]').nth(0);
    this.centerCityInput = page.locator('select').nth(0);
    this.centerAddressInput = page.locator('input[required]').nth(1);
    this.centerPhoneInput = page.locator('input[required]').nth(2);
    this.centerEmailInput = page.locator('input[type="email"]');
    this.centerHoursInput = page.locator('input[placeholder*="e.g. 9:00 AM"]');
    this.centerDescInput = page.locator('textarea');
    this.centerSubmitButton = page.locator('button:has-text("Save Center")');

    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.tableRows = page.locator("tbody tr");
  }

  async selectTab(tab: "users" | "pickups" | "centers") {
    if (tab === "users") await this.usersTab.click();
    if (tab === "pickups") await this.pickupsTab.click();
    if (tab === "centers") await this.centersTab.click();
  }

  async createRecyclingCenter(details: {
    name: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    desc: string;
  }) {
    await this.selectTab("centers");
    await this.addCenterButton.click();
    await this.centerNameInput.fill(details.name);
    await this.centerCityInput.selectOption(details.city);
    await this.centerAddressInput.fill(details.address);
    await this.centerPhoneInput.fill(details.phone);
    await this.centerEmailInput.fill(details.email);
    await this.centerHoursInput.fill(details.hours);
    
    // Check at least one waste checkbox to bypass required fields validation checks
    await this.page.locator('input[type="checkbox"]').first().check();
    
    await this.centerDescInput.fill(details.desc);
    await this.centerSubmitButton.click();
  }
}
