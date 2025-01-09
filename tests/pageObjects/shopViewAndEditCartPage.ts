import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class shopViewAndEditCartPage extends BasePage {
  public removePackageButton: Locator;

  constructor(page: Page) {
    super(page);

    this.removePackageButton = page.locator(
      "//button[@aria-label='Delete Package']"
    );
  }
  async getDelectButton(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Packages Card"]//button`;
  }

  async getPackageCardLocator(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Packages Card"]`;
  }
}
