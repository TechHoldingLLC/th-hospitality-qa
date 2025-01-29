import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class shopViewAndEditCartPage extends BasePage {
  public removePackageButton: Locator;
  public checkOutButton: Locator;
  public closeCartSectionButton: Locator;
  public checkoutPageTitleLabel: Locator;
  public backToCartPageButton: Locator;
  public packageTitleInCartPage: Locator;

  constructor(page: Page) {
    super(page);

    this.removePackageButton = page.locator(
      "//button[@aria-label='Delete Package']"
    );
    this.checkOutButton = page.locator("//button[text()='Checkout']");
    this.closeCartSectionButton = page.locator(
      "//button[@aria-label='Close Cart Drawer']"
    );
    this.checkoutPageTitleLabel = page.locator("//h1[text()='Checkout']");
    this.backToCartPageButton = page.locator(
      "//nav//a/span[text()='Back to shopping cart']"
    );
    this.packageTitleInCartPage = page.locator(
      "//p[@aria-label='Package Name']"
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

  /**
   * Edits the quantity of a specified package in the cart and removes the package.
   *
   * @param {string} packageName - The name of the package to be edited and removed from the cart.

   */
  async editQtyAndRemovePackage(packageName: string) {
    // Edit Quantity
    await this.enterValuesInElement(
      this.page.locator(await this.getPackageQuantityField(packageName)),
      "2"
    );

    await this.page.keyboard.press("Tab");
    await this.page.waitForTimeout(1000);

    // Click on Delete button
    await this.clickElement(
      this.page.locator(await this.getRemovePackageButton(packageName))
    );

    await this.waitForElementHidden(
      this.page.locator(await this.getRemovePackageButton(packageName))
    );
  }
}
