import { chromium, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "./adminLoginPage";

export class shopAddItemInCartPage extends BasePage {
  public viewPackageButton: Locator;
  public packageTitleLabel: Locator;
  public quantityInputField: Locator;
  public addToCartButton: Locator;
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
  public updateInCartButton: Locator;

  // Packages page locator
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
    this.addToCartButton = page.locator(
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
    this.updateInCartButton = page.locator("//button[text()='Update in Cart']");
  }

  // Add item to cart
  async addItemInCart(): Promise<string> {
    let packageTitle: string = "";

    // Click on View Package button
    await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

    // Check package is not out of stock
    let isPackageOutofStock = await this.outOfStockButton.isVisible();
    if (isPackageOutofStock) {
      // Close cart pop up
      await this.clickElement(this.closeCartDrawerButton);

      // Click on View Package button again
      await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

      isPackageOutofStock = await this.outOfStockButton.isVisible();
    }

    if (!isPackageOutofStock) {
      // Get title of package title
      packageTitle = await this.packageTitleLabel.innerText();

      console.log(packageTitle);
      // Click on Add to Cart button
      await this.clickElement(this.addToCartButton);
      await this.page.waitForTimeout(3000);

      // click on Cart button
      await this.clickElement(this.cartButton);
    }

    return packageTitle;
  }

  // Get Available Quantity and Max Quantity per order from Admin panel
  async retrievePackageData(
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
  async addMultiplePackagesToCart(): Promise<{
    listOfAddedPackage: string[];
    totalAmount: number;
  }> {
    await this.waitForPageToBeReady();

    await this.waitForElementVisible(this.viewPackageButton.first());

    let totalOrderAmount: number = 0;
    let addedPackageNames: string[] = [];

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

      // Check package is already added or not
      let isPackageAlreadyAdded = await this.updateInCartButton.isVisible();

      if (!isPackageOutofStock && !isPackageAlreadyAdded) {
        // Get price of package
        const packagePrice: number = parseFloat(
          (await this.packagePriceLabel.allTextContents())
            .toString()
            .replace("$", "")
        );

        // Get title of package title
        const packageTitle: string = await this.packageTitleLabel.innerText();

        // Click on Add to Cart button
        await this.clickElement(this.addToCartButton);

        await this.waitForPageToBeReady();
        await this.page.waitForTimeout(3000);

        totalOrderAmount += packagePrice;

        // Check if the value is already in  the array
        if (!addedPackageNames.includes(packageTitle))
          addedPackageNames.push(packageTitle);
      } else {
        // Close cart pop up
        await this.clickElement(this.closeCartDrawerButton);
      }
    }

    return {
      listOfAddedPackage: addedPackageNames,
      totalAmount: totalOrderAmount,
    };
  }

  // Add all available package in cart
  async addAllPackageInCart(): Promise<string[]> {
    await this.waitForPageToBeReady();

    await this.waitForElementVisible(this.viewPackageButton.first());

    let addedPackageNames: string[] = [];

    let totalPackage = (await this.viewPackageButton.all()).length;

    for (let index: number = 0; index < totalPackage; index++) {
      // Click on View Package button
      await this.clickElement(this.viewPackageButton.nth(index));

      // Check package is not out of stock
      let isPackageOutofStock = await this.outOfStockButton.isVisible();

      if (!isPackageOutofStock) {
        // Get title of package title
        const packageTitle: string = await this.packageTitleLabel.innerText();

        // Click on Add to Cart button
        await this.clickElement(this.addToCartButton);

        await this.waitForPageToBeReady();
        await this.page.waitForTimeout(3000);

        // Check if the value is already in  the array
        if (!addedPackageNames.includes(packageTitle))
          addedPackageNames.push(packageTitle);
      } else {
        // Close cart pop up
        await this.clickElement(this.closeCartDrawerButton);
      }
    }
    return addedPackageNames;
  }

  // Get Available Quantity and Max Quantity per order from Admin panel
  async getNumberOfAvialableQtyAndMaxQtyPerOrderFromAdmin(
    packageName: string
  ): Promise<{ availableQty: number; maxQtyPerOrder: number }> {
    const browser = await chromium.launch({
      headless: false,
      channel: "chrome",
    });

    // Open new tab
    const newTab: Page = await browser.newPage();
    const login: adminLoginPage = new adminLoginPage(newTab);
    const addItemInCart: shopAddItemInCartPage = new shopAddItemInCartPage(
      newTab
    );

    // Open admin portal and login
    await newTab.goto(config.adminPortalUrl);
    await login.login(config.email, config.password);

    // Navigate to Packages
    await addItemInCart.packagesButton.click();

    // Get Available Quantity and Max Quantity per order Data
    const { availableQty, maxQtyPerOrder } =
      await addItemInCart.retrievePackageData(packageName);

    await newTab.close();

    return { availableQty, maxQtyPerOrder };
  }
}