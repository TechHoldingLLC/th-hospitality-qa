import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class shopOrdersTabInMyAccountPage extends BasePage {
  public myAccountLink: Locator;
  public myAccountLabel: Locator;
  public ordersButton: Locator;
  public orderListLocator: Locator;
  public selectPackageDropdown: Locator;
  public selectPackageOptionList: Locator;
  public statusIndicatorOfGuestRegistartion: Locator;
  public addGuestButton: Locator;
  public editAndDeleteMenuButton: Locator;
  public editGuestButton: Locator;
  public deleteGuestButton: Locator;
  public incompleteStatusLocatorInCollapseView: Locator;
  public incompleteStatusLocatorInExpandView: Locator;
  public incompleteGuestInformationMessageLabel: Locator;
  public nextPageButton: Locator;

  constructor(page: Page) {
    super(page);

    this.myAccountLink = page.locator("//a[text()='My Account']");
    this.myAccountLabel = page.locator("//h1[text()='My Account']");
    this.ordersButton = page.locator(
      "//button[contains(@aria-controls,'orders')]"
    );
    this.orderListLocator = page.locator(
      "//a[contains(@href,'account/orders/order')]"
    );
    this.selectPackageDropdown = page.locator(
      "//label[text()='Select Package']/following-sibling::button"
    );
    this.selectPackageOptionList = page.locator(
      "//div[@role='option']/span[text()!='']"
    );
    this.statusIndicatorOfGuestRegistartion = page.locator(
      "//label[text()='# of Guests:']/following-sibling::p/*[name()='svg'][2]//*[name()='path'][1]"
    );
    this.addGuestButton = page.locator(
      "//span[text()='Add Guest']/parent::button"
    );
    this.editAndDeleteMenuButton = page.locator(
      "//div[normalize-space()='Guest 1']/following-sibling::button[@aria-haspopup='menu']"
    );
    this.editGuestButton = page.locator(
      "//span[text()='Edit Guest']/parent::div[@role='menuitem']"
    );
    this.deleteGuestButton = page.locator(
      "//span[text()='Delete Guest']/parent::div[@role='menuitem']"
    );
    this.incompleteGuestInformationMessageLabel = page.locator(
      "//div[@data-side='top']/span"
    );
    this.incompleteStatusLocatorInCollapseView = page.locator(
      "//label[text()='# of Guests:']/following-sibling::p/*[name()='svg'][2]//*[name()='path' and @stroke='#F97316'][1]"
    );
    this.incompleteStatusLocatorInExpandView = page.locator(
      "//div/div[@class='w-full ']//label[text()='# of Guests:']/following-sibling::p/*[name()='svg'][2]"
    );
    this.nextPageButton = page.locator("//button[@aria-label='Next page']");
  }

  async getFieldsLocatorForOrderData(fieldName: string) {
    return `//label[text()='${fieldName}:']/following-sibling::p/span[text() != '']`;
  }

  /**
   * Navigates to the "Orders" tab from the "My Account" page.
   *
   * @returns {Promise<void>} - Resolves once the navigation is complete.
   */
  async navigateToOrdersTab() {
    // Click on my account
    await this.clickElement(this.myAccountLink);

    await this.page.waitForTimeout(2000);
    await this.waitForPageToBeReady();
    await this.waitForElementVisible(this.myAccountLabel);

    // Click on Orders tab
    await this.clickElement(this.ordersButton);

    await this.waitForPageToBeReady();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Retrieves the total number of guests from all available options in the "Select Package" dropdown.
   *
   * @returns {Promise<number>} - Resolves to the total number of guests across all options in the dropdown.
   */
  async getTotalGuestsFromselectPackageDropdownOption(): Promise<number> {
    let totalGuestsCount = 0;

    // Click on Select Package dropdown
    await this.clickElement(this.selectPackageDropdown);

    const optionListLocators: Locator[] =
      await this.selectPackageOptionList.all();

    // Get number of Guest from all packages
    for (const option of optionListLocators) {
      const optionText: string = await this.getElementText(option);

      const getNumberMatches = optionText.match(/\((\d+)\/(\d+)\)/);

      totalGuestsCount = getNumberMatches
        ? totalGuestsCount + parseInt(getNumberMatches[2])
        : totalGuestsCount;
    }

    return totalGuestsCount;
  }

  /**
   * Expands an order based on the status of guest information (Complete or Incomplete).
   *
   * @param guestInformationStatus - The status of the guest information to filter orders by.
   *
   * @returns {Promise<boolean>} - Resolves to a boolean indicating whether an order was expanded:
   */
  async expandOrderByStatusOfGuestInformation(
    guestInformationStatus: "Incomplete" | "Complete"
  ): Promise<boolean> {
    let orderExpanded: boolean = false;

    const orderList: Locator[] = await this.page
      .locator(await this.getFieldsLocatorForOrderData("# of Guests"))
      .all();

    for (const order of orderList) {
      // Get text from "# of Guests"
      const getTextOfNoOfGuestLabel: string = await this.getElementText(order);

      // Get complete Guest information number from getTextOfNoOfGuestLabel
      const completeGuestInformationNumber = parseInt(
        getTextOfNoOfGuestLabel.split("/")[0]
      );

      // Get total Guest number from getTextOfNoOfGuestLabel
      const totalNumberOfGuests = parseInt(
        getTextOfNoOfGuestLabel.split("/")[1]
      );

      // if incomplete Guest Information order found, Expand that order
      if (
        (guestInformationStatus == "Incomplete" &&
          completeGuestInformationNumber < totalNumberOfGuests) ||
        (guestInformationStatus == "Complete" &&
          completeGuestInformationNumber > 0)
      ) {
        this.clickElement(order);

        this.waitForElementVisible(this.selectPackageDropdown);

        orderExpanded = true;
        break;
      }
    }

    return orderExpanded;
  }

  /**
   * Clicks on a package option based on the guest information status.
   *
   * @param guestInformationStatus - The status of the guest information. Can be either:
   *
   */
  async clickOnPackageByStatusOfGuestInformation(
    guestInformationStatus: "Incomplete" | "Complete"
  ) {
    const packagesList: Locator[] = await this.selectPackageOptionList.all();

    for (const packageName of packagesList) {
      // Get text from package option
      const getTextOfPackageName: string = await this.getElementText(
        packageName
      );

      const getNumberMatches = getTextOfPackageName.match(/\((\d+)\/(\d+)\)/);

      // Get complete Guest details number
      const addedGuestDetailsNumber: number = getNumberMatches
        ? parseInt(getNumberMatches[1])
        : -1;

      // Get Total Guest number for this package
      const totalGuestDetailsNumber: number = getNumberMatches
        ? parseInt(getNumberMatches[2])
        : -1;

      // Click on package option if addedGuestDetailsNumber less than totalGuestDetailsNumber
      if (
        (guestInformationStatus == "Incomplete" &&
          addedGuestDetailsNumber < totalGuestDetailsNumber) ||
        (guestInformationStatus == "Complete" && addedGuestDetailsNumber > 0)
      ) {
        this.clickElement(packageName);

        break;
      }
    }
  }

  /**
   * Navigates through program order pages to find an expired program order based on the program date.
   * If an expired program order is found, it clicks on it and navigates to the corresponding order page.
   * If no expired program order is found or if the "Next" button is disabled, it stops the search.
   *
   * @returns {Promise<boolean>} - Returns `true` if an expired program order is found and navigated to,
   *                               `false` if no expired order is found or there are no more pages.
   */
  async navigateToExpiredProrgramOrder(): Promise<boolean> {
    let isNavigateToOrder: boolean = false; // Flag to track whether we should navigate to the expired program order
    let isnextButtonEnabled: boolean = false; // Flag to track whether the 'next' button is enabled

    while (!isNavigateToOrder) {
      // Get the locators for all 'Program Date' elements on the current page
      const programDateLocators: Locator[] = await this.page
        .locator(await this.getFieldsLocatorForOrderData("Program Date"))
        .all();

      for (const element of programDateLocators) {
        // Extract the program date text
        const programDateLabel: string = (await this.getElementText(element))
          .split("-")[1]
          .trim(); // Get the date part and remove any extra spaces

        // Get today's date
        const todayDate = new Date();

        // Convert the program date from string to a Date object
        const programDate = new Date(programDateLabel);

        if (programDate < todayDate) {
          // Epand Order
          await this.clickElement(element);

          await this.waitForElementVisible(this.selectPackageDropdown);

          return true;
        }
      }

      // Check if the 'next' button is enabled to determine if we should go to the next page
      isnextButtonEnabled = (await this.nextPageButton.isEnabled()).valueOf();

      // If the 'next' button is not enabled, it means there are no more pages to navigate to
      if (!isnextButtonEnabled) {
        console.log("Experied Program order is not available");
        break;
      }

      // Click on next button if enabled
      await this.clickElement(this.nextPageButton);

      console.log("naviage 2");
      // Wait for page load
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(2000);
    }

    return isNavigateToOrder;
  }
}
