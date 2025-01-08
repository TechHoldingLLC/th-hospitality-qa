import { Browser, Locator, Page, expect } from "@playwright/test";
import BasePage from "./basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "./adminLoginPage";

export class soapAddItemInCartPage extends BasePage {
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
    this.addToCardButton = page.locator("//button[text()='Add to Cart']");
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
      "//p[@aria-label='Error Message']"
    );
    this.totalAmountValueLabel = page.locator(
      "//p[text()='Total Amount']/following-sibling::p"
    );
  }

  // Add item in cart
  async addItemInCartPage(numberOfTrytoAdd: number): Promise<string> {
    // Maximum try three time to add Item
    expect(
      numberOfTrytoAdd,
      "We have try three time to find available package but not found"
    ).toBeLessThan(4);

    // Click on View Package button
    await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

    // Verify Package details pop up open or not
    expect(await this.isElementVisible(this.packageTitleLabel)).toBe(true);

    const packageTitle: string = await this.packageTitleLabel.innerText();
    console.log(packageTitle);

    // Click on Add to Cart button
    await this.clickElement(this.addToCardButton);

    expect(await this.isElementVisible(this.cartButton)).toBe(true);
    await this.page.waitForTimeout(3000);

    // Check item out of stock or not
    const outOfStockNotification: boolean =
      await this.notificationLabel.isVisible();

    if (outOfStockNotification) {
      numberOfTrytoAdd++;
      this.addItemInCartPage(numberOfTrytoAdd);
    } else {
      // click on Cart button
      await this.clickElement(this.cartButton);

      // Verify My Cart section open or not
      expect(await this.isElementVisible(this.cartSection)).toBe(true);

      // Verify item added or not in cart page
      expect(await this.packageTitleInCartPage.last().textContent()).toBe(
        packageTitle
      );
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

    // Check package is display in page or not
    await this.page.waitForTimeout(3000);
    let productFound: boolean = (await packageLocator.isVisible()).valueOf();

    if (!productFound) {
      let isnextButtonEnabled: boolean = (
        await this.nextButton.isEnabled()
      ).valueOf();

      if (isnextButtonEnabled) {
        // Click on next button
        await this.clickElement(this.nextButton);

        // Wait for page load
        await this.page.waitForLoadState("domcontentloaded");

        await this.getNumberOfAvialableQtyAndMaxQtyPerOrder(packageName);
      } else {
        console.log(packageName + " is not found in this page");
        expect(false).toBeTruthy();
      }
    } else {
      // Click on package link
      await this.clickElement(packageLocator);

      this.waitForPageToBeReady();
      await this.page.waitForTimeout(5000);

      // Verify Total Quantity Available element display or not
      expect(await this.isElementVisible(this.availableQuantityLabel)).toBe(
        true
      );

      // Verify Max Quantity Per Order element display or not
      expect(await this.isElementVisible(this.maxQuantityPerOrderLabel)).toBe(
        true
      );

      availableQty = Number(await this.availableQuantityLabel.textContent());
      maxQtyPerOrder = Number(
        await this.maxQuantityPerOrderLabel.textContent()
      );
    }

    return { availableQty, maxQtyPerOrder };
  }

  // Update Quantity in Cart page
  async updateQuantityInCartPage(quantity: string) {}
}
