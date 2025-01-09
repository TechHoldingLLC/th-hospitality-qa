import { Browser, Locator, Page, expect } from "@playwright/test";
import BasePage from "./basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "./adminLoginPage";

export class shopAddItemInCartPage extends BasePage {
  public viewPackageButton: Locator;
  public packageTitleLabel: Locator;
  public quantityInputField: Locator;
  public addToCardButton: Locator;
  public notificationLabel: Locator;
  public cartButton: Locator;
  public packageQuantityField: Locator;
  public packageTitleInCartPage: Locator;
  public cartSection: Locator;
  public cartErrorMessage: Locator;
  public emptyCartTitle: Locator;
  public emptyCartErrorMessage: Locator;
  public totalAmountValueLabel: Locator;
  public closeCartDrawerButton: Locator;
  public packagePriceLabel: Locator;
  public outOfStockButton: Locator;

  // Packages pages locator
  public packagesButton: Locator;
  public nextButton: Locator;
  public availableQuantityLabel: Locator;
  public maxQuantityPerOrderLabel: Locator;

  constructor(page: Page) {
    super(page);

    this.viewPackageButton = page.locator(
      "//button/span[text()='View Package']"
    );
    this.packageTitleLabel = page.locator(
      "//section[@role='dialog']//h3[@aria-label='Package Title']"
    );
    this.quantityInputField = page.locator("//input[@aria-label='Quantity']");
    this.addToCardButton = page.locator(
      "//button[@aria-label='Add/Update to Cart Button']"
    );
    this.notificationLabel = page.locator(
      "(//section[contains(@aria-label,'Notifications')]//span)[2]"
    );
    this.cartButton = page.locator("//button[@aria-label='Cart Button']");
    this.packageQuantityField = page.locator(
      "//input[@aria-label='Package Quantity']"
    );
    this.packageTitleInCartPage = page.locator(
      "//p[@aria-label='Package Name']"
    );
    this.cartSection = page.locator("//section[@aria-label='Cart Drawer']");
    this.packagesButton = page.locator("//a[@href='/packages']");
    this.nextButton = page.locator("//button[text()='Next']");
    this.availableQuantityLabel = page.locator(
      "//label[text()='Total Quantity Available']/following-sibling::label[number(text()) > 0]"
    );
    this.maxQuantityPerOrderLabel = page.locator(
      "//label[text()='Max Quantity Per Order']/following-sibling::label[number(text()) > 0]"
    );
    this.cartErrorMessage = page.locator(
      "//div[@aria-label='Cart Error Message']"
    );
    this.emptyCartTitle = page.locator("//h3[text()='Empty Cart']");
    this.emptyCartErrorMessage = page.locator(
      "//*[@aria-label='Error Message']"
    );
    this.totalAmountValueLabel = page.locator(
      "//p[text()='Total Amount']/following-sibling::p"
    );
    this.closeCartDrawerButton = page.locator(
      "//button[@aria-label='Close Cart Drawer']"
    );
    this.packagePriceLabel = page.locator(
      "//p[text()='Package Price']/following-sibling::p"
    );
    this.outOfStockButton = page.locator("//button[text()='Out of Stock']");
  }

  // Add item in cart
  async addItemInCartPage(): Promise<string> {
    let packageTitle: string = "";

    // Click on View Package button
    await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

    // Check package is not out of stock
    let isPackageOutofStock = await this.outOfStockButton.isVisible();
    if (isPackageOutofStock) {
      await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

      isPackageOutofStock = await this.outOfStockButton.isVisible();
    }

    if (!isPackageOutofStock) {
      // Get title of package title
      packageTitle = await this.packageTitleLabel.innerText();

      // Click on Add to Cart button
      await this.clickElement(this.addToCardButton);
      await this.page.waitForTimeout(3000);

      // click on Cart button
      await this.clickElement(this.cartButton);
    }

    return packageTitle;
  }

  // Get Available Quantity and Max Quantity per order from package page
  async getNumberOfAvialableQtyAndMaxQtyPerOrder(
    packageName: string
  ): Promise<{ availableQty: number; maxQtyPerOrder: number }> {
    let availableQty: number = 0;
    let maxQtyPerOrder: number = 0;

    // Search Package and get Data
    const packageLocator: Locator = this.page.locator(
      '//span[text()="' + packageName + '"]'
    );

    // Wait for the page to load
    await this.page.waitForTimeout(3000);

    let packageFound: boolean = (await packageLocator.isVisible()).valueOf();
    let isnextButtonEnabled: boolean = false;

    // Continue searching if the package is not found and the "Next" button is enabled
    while (!packageFound) {
      isnextButtonEnabled = (await this.nextButton.isEnabled()).valueOf();

      if (!isnextButtonEnabled) {
        console.log(packageName + " is not found in this page");
        break;
      }

      // Click on next button if enabled
      await this.clickElement(this.nextButton);

      // Wait for page load
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(2000);

      // Check again if the package is available on the next page
      packageFound = (await packageLocator.isVisible()).valueOf();
    }

    // If package is found, navigate to its details and retrieve the quantities
    if (packageFound) {
      // Click on package link
      await this.clickElement(packageLocator);

      // Wait for the page to be ready
      this.waitForPageToBeReady();
      await this.page.waitForTimeout(5000);

      // Get available quantity and max quantity per order
      availableQty = Number(await this.availableQuantityLabel.textContent());

      maxQtyPerOrder = Number(
        await this.maxQuantityPerOrderLabel.textContent()
      );
    }

    return { availableQty, maxQtyPerOrder };
  }

  // Add multiple Package in cart
  async addMultiplePackageInCart(): Promise<number> {
    await this.waitForPageToBeReady();

    await this.waitForElementVisible(this.viewPackageButton.first());

    let totalOrderAmount: number = 0;
    let totalPackage = (await this.viewPackageButton.all()).length;

    totalPackage = totalPackage > 10 ? 10 : totalPackage;

    // Generate random number
    const randomNumber: number =
      Math.floor(Math.random() * (totalPackage - 1)) + 1;

    for (let index: number = 0; index < randomNumber; index++) {
      // Click on View Package button
      await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

      // Check package is not out of stock
      let isPackageOutofStock = await this.outOfStockButton.isVisible();

      if (!isPackageOutofStock) {
        // Get price of package
        const packagePrice: number = parseFloat(
          (await this.packagePriceLabel.allTextContents())
            .toString()
            .replace("$", "")
        );

        // Click on Add to Cart button
        await this.clickElement(this.addToCardButton);

        await this.waitForPageToBeReady();
        await this.page.waitForTimeout(3000);

        totalOrderAmount += packagePrice;
      }
    }

    return totalOrderAmount;
  }
}
