import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class shopViewAndEditCartPage extends BasePage {
  public removePackageButton: Locator;
  public checkOutButton: Locator;
  public closeCartSectionButton: Locator;

  constructor(page: Page) {
    super(page);

    this.removePackageButton = page.locator(
      "//button[@aria-label='Delete Package']"
    );
    this.checkOutButton = page.locator("//a[text()='Checkout']");
    this.closeCartSectionButton = page.locator(
      "//button[@aria-label='Close Cart Drawer']"
    );
  }
  async getDelectButton(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Packages Card"]//button`;
  }

  async getPackageCardLocator(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Packages Card"]`;
  }

  async getPackageQuantityField(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Packages Card"]//input`;
  }
}
