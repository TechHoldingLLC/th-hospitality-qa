import { chromium, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { config, EventType } from "../config/config.qa";
import { adminLoginPage } from "./adminLoginPage";

export class shopAddItemInCartPage extends BasePage {
  public viewPackageButton: Locator;
  public packageTitleLabel: Locator;
  public quantityInputField: Locator;
  public addToCartButton: Locator;
  public cartButton: Locator;
  public cartSection: Locator;
  public cartErrorMessage: Locator;
  public emptyCartTitle: Locator;
  public emptyCartErrorMessage: Locator;
  public totalAmountValueLabel: Locator;
  public closeCartDrawerButton: Locator;
  public packagePriceLabel: Locator;
  public outOfStockButton: Locator;
  public updateInCartButton: Locator;
  public eventsListLocator: Locator;
  public removePackageButton: Locator;

  // Packages page locator
  public packagesButton: Locator;
  public nextButton: Locator;
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
    this.cartButton = page.locator("//button[@aria-label='Cart Button']");
    this.cartSection = page.locator("//section[@aria-label='Cart Drawer']");
    this.packagesButton = page.locator("//a[@href='/packages']");
    this.nextButton = page.locator("//button[text()='Next']");
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
      "//header/button[@aria-label='Close Cart Drawer']"
    );
    this.packagePriceLabel = page.locator(
      "//p[text()='Package Price']/following-sibling::p"
    );
    this.outOfStockButton = page.locator("//button[text()='Out of Stock']");
    this.updateInCartButton = page.locator("//button[text()='Update in Cart']");
    this.eventsListLocator = page.locator(
      "//div[contains(@aria-label,'Program')]//button[@aria-label='Event Accordion Trigger']"
    );
    this.removePackageButton = page.locator(
      "//button[@aria-label='Delete Package']"
    );
  }

  async getPackageTitleLocatorInCartPage(packageName: string) {
    return `//p[@aria-label='Package Name' and text()='${packageName}']`;
  }

  async getPackageQuantityField(packageName: string) {
    return `//p[text()='${packageName}']//ancestor::div[@aria-label="Cart Package Card"]//input`;
  }

  async getAvailableQuantityLabel(packageName: string) {
    return `//span[text()="${packageName}"]/ancestor::tr/td[7]//span`;
  }

  /**
   * Adds a random item to the cart by selecting a package, checking if it's available,
   * and clicking on the "Add to Cart" button. If the item is out of stock,
   * it attempts to add another item.
   *
   * @returns {Promise<string>} Resolves to the title of the added package.
   */
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

      // Click on Add to Cart button
      await this.clickElement(this.addToCartButton);
      await this.waitForPageToBeReady();
      await this.page.waitForTimeout(3000);
    }

    return packageTitle;
  }

  /**
   * Retrieves the available quantity and the maximum quantity per order of a package by its name.
   *
   * This function searches for a package by name, handles pagination if the package is not found on the current page,
   * and extracts the available and maximum quantities from the package details
   *
   * @param {string} packageName - The name of the package to search for.
   * @returns {Promise<{ availableQty: number; maxQtyPerOrder: number }>} Resolves to an object containing available quantity and max quantity per order.
   */
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
      // Get available quantity max quantity per order
      availableQty = Number(
        await this.page
          .locator(await this.getAvailableQuantityLabel(packageName))
          .textContent()
      );

      // Click on package link
      await this.clickElement(packageLocator);

      // Wait for element visible
      await this.isElementVisible(this.maxQuantityPerOrderLabel);

      // Get max quantity per order
      maxQtyPerOrder = Number(
        await this.maxQuantityPerOrderLabel.textContent()
      );
    }

    return { availableQty, maxQtyPerOrder };
  }

  /**
   * Adds a random number of packages (up to 10) to the cart, calculates the total order amount,
   * and returns the total price of the added packages.
   *
   * @returns {Promise<number>} The total order amount after adding the packages to the cart.
   */
  async addMultiplePackagesToCart(): Promise<number> {
    await this.waitForPageToBeReady();

    if (config.eventType == EventType.multipleEvent)
      await this.waitForElementVisible(this.eventsListLocator.first());
    else await this.waitForElementVisible(this.viewPackageButton.first());

    let totalOrderAmount: number = 0;
    let totalPackageOrEvent =
      config.eventType == EventType.multipleEvent
        ? (await this.eventsListLocator.all()).length
        : (await this.viewPackageButton.all()).length;

    totalPackageOrEvent = totalPackageOrEvent > 10 ? 10 : totalPackageOrEvent;

    // Generate random number
    const randomNumber: number =
      Math.floor(Math.random() * (totalPackageOrEvent - 1)) + 1;

    for (let index: number = 0; index < randomNumber; index++) {
      if (config.eventType == EventType.multipleEvent) {
        await this.expandEventRandomly();
        await this.page.waitForTimeout(2000);

        if ((await this.viewPackageButton.all()).length == 0) continue;
      }

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

        // Click on Add to Cart button
        await this.clickElement(this.addToCartButton);

        await this.waitForPageToBeReady();
        await this.page.waitForTimeout(3000);

        totalOrderAmount += packagePrice;

        await this.clickElement(this.closeCartDrawerButton);
      } else {
        // Close cart pop up
        await this.clickElement(this.closeCartDrawerButton);
      }
    }

    await this.waitForPageToBeReady();
    return totalOrderAmount;
  }

  /**
   * Retrieves the available quantity and maximum quantity per order for a specified package from the admin portal.
   *
   * @param {string} packageName - The name of the package for which the quantities are to be retrieved.
   * @returns {Promise<{ availableQty: number; maxQtyPerOrder: number }>} - Resolves to an object containing the available quantity and maximum quantity per order of the specified package.
   */
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

  /**
   * Opens the package detail popup and updates the quantity.
   *
   * @param {string} inputValue - The value to set in the quantity input field for the package.
   *
   */
  async editQuantityInPackageDetailsPopup(inputValue: string): Promise<void> {
    // Click on View Package button
    await this.selectRandomItemFromMultiSelectList(this.viewPackageButton);

    await this.waitForPageToBeReady();

    // Enter value in quantity field
    await this.enterValuesInElement(this.quantityInputField, inputValue);
  }

  /**
   * This method expands a random event from a list of events and checks if the expansion was successful.
   *
   * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the random event was successfully expanded, `false` otherwise.
   */
  async expandEventRandomly(): Promise<boolean> {
    let eventExpanded = false;

    // Wait for loading events
    await this.waitForElementVisible(this.eventsListLocator.first());

    // Get count of visible events
    const eventsCount: number = (await this.eventsListLocator.all()).length;

    if (eventsCount > 0) {
      const randomOrder = Math.floor(Math.random() * (eventsCount - 0) + 0);

      // Click on order for expand view
      await this.clickElement(this.eventsListLocator.nth(randomOrder));

      eventExpanded =
        (await this.eventsListLocator
          .nth(randomOrder)
          .getAttribute("aria-expanded")) == "true";
    }

    return eventExpanded;
  }

  /**
   * Expands events if the event type is 'multipleEvent' and ensures at least one package is present.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the event expansion is successful
   *                                or if the event type is not `multipleEvent`; otherwise, `false`.
   */
  async expandEventForMultipleType(): Promise<boolean> {
    if (config.eventType == EventType.multipleEvent) {
      await this.expandEventRandomly();

      // If no package found after the first expansion attempt, try again
      if (
        (await this.viewPackageButton.all()).length == 0 &&
        !(await this.expandEventRandomly())
      )
        return false;
    }

    return true;
  }

  /**
   * Clears all packages from the cart by removing them one by one.
   */
  async clearCart(): Promise<void> {
    // Click on Cart button
    await this.clickElement(this.cartButton);

    await this.waitForPageToBeReady();

    // Wait for open Cart section
    await this.waitForElementVisible(this.totalAmountValueLabel);

    // Get the initial count of packages in the cart
    let countOfPackage: number = await this.removePackageButton.count();

    while (countOfPackage > 0) {
      // Click the first remove package button
      await this.clickElement(this.removePackageButton.nth(0));

      // Wait until the number of packages is reduced by one (with a timeout mechanism)
      await this.waitForPackageCount(countOfPackage - 1, 5000);

      countOfPackage--;
    }

    // Clost Cart section
    await this.clickElement(this.closeCartDrawerButton);
  }

  /**
   * Custom function to wait for the package count to match the expected count
   *
   * @param {number} expectedCount - The target package count to wait for.
   * @param {number} timeout - The maximum time (in milliseconds) to wait for the count to match the expected value.
   *
   * @throws {Error} - If the timeout is exceeded without the package count matching the expected count.
   */
  async waitForPackageCount(
    expectedCount: number,
    timeout: number
  ): Promise<void> {
    const startTime = Date.now();

    while (true) {
      const currentCount = await this.removePackageButton.count();

      // Check if the current count matches the expected count
      if (currentCount === expectedCount) {
        return;
      }

      // If the timeout has passed, throw an error
      if (Date.now() - startTime > timeout) {
        throw new Error(
          `Timed out after ${
            timeout / 1000
          } seconds waiting for package count to become ${expectedCount}`
        );
      }

      // Wait before polling again
      await this.page.waitForTimeout(500);
    }
  }
}
