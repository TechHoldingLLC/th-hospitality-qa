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
  async getRemovePackageButton(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Package Card"]//button`;
  }

  async getPackageCardLocator(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Packages Card"]`;
  }

  async getPackageQuantityField(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Package Card"]//input`;
  }

  // Edit quantity and click on remove package from cart
  async editQtyAndRemovePackage(packageName: string) {
    // Edit Quantity
    await this.enterValuesInElement(
      this.page.locator(await this.getPackageQuantityField(packageName)),
      "2"
    );

    await this.page.waitForTimeout(1000);

    // Click on Delete button
    await this.clickElement(
      this.page.locator(await this.getRemovePackageButton(packageName))
    );

    await this.waitForPageToBeReady();

    await this.page.waitForTimeout(4000);
  }
}
