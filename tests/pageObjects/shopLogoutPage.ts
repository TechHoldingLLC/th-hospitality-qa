import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class shopLogoutPage extends BasePage {
  public myProfileButton: Locator;
  public logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.myProfileButton = page.locator(
      "//span[contains(@class,'aspect-square')]"
    );
    this.logoutButton = page.locator("//p[text()='Log out']");
  }

  async logout(): Promise<void> {
    // Click on my profile button
    await this.clickElement(this.myProfileButton);

    // Click on Log out button
    await this.clickElement(this.logoutButton);
  }
}
