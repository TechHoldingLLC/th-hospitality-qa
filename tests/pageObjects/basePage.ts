import { Page, Locator, expect } from "@playwright/test";

export default class BasePage {
  readonly page: Page;
  createAccountLink: any;

  constructor(page: Page) {
    this.page = page;
  }

  // Common method to navigate to a URL
  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  // Common method to click an element
  async clickElement(element: Locator) {
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  // Common method to fill out an element
  async enterValuesInElement(element: Locator, valuesToEnter: string) {
    await element.fill(valuesToEnter);
  }

  //Common method to retrieve text from an element
  async getElementText(element: Locator): Promise<string> {
    return element.innerText();
  }

  // Common method to wait for an element to be visible
  async waitForElementVisible(element: Locator | string) {
    if (typeof element === "string") {
      await this.page.waitForSelector(element, { state: "visible" });
    } else {
      await element.waitFor({ state: "visible" });
    }
  }

  // Common method to wait for an element to be hidden
  async waitForElementHidden(element: Locator) {
    if (typeof element === "string") {
      await this.page.waitForSelector(element, { state: "hidden" });
    } else {
      await element.waitFor({ state: "hidden" });
    }
  }

  // Common method to take a screenshot
  async takeScreenshot(fileName: string) {
    await this.page.screenshot({ path: fileName });
  }

  async waitForElementToAppearAndDisappear(
    selector: string | Locator
  ): Promise<void> {
    // If the selector is a string, use waitForSelector, otherwise directly use the locator
    if (typeof selector === "string") {
      // Wait for the selector to be visible
      await this.page.waitForSelector(selector, { state: "visible" });
      // Wait for the selector to be hidden
      await this.page.waitForSelector(selector, { state: "hidden" });
    } else {
      // If it's a Locator, use the locator's API directly
      await selector.waitFor({ state: "visible" });
      await selector.waitFor({ state: "hidden" });
    }
  }

  async waitForPageToBeReady(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async isElementVisible(element: Locator): Promise<boolean> {
    await element.waitFor({ state: "visible" });
    return await element.isVisible();
  }

  async isElementDisabled(element: Locator): Promise<boolean> {
    await element.waitFor({ state: "visible" });
    return await element.isDisabled();
  }

  async isElementEnabled(element: Locator): Promise<boolean> {
    await element.waitFor({ state: "visible" });
    return await element.isEnabled();
  }

  async getAllTextContents(element: Locator): Promise<string[]> {
    return await element.allTextContents();
  }

  // Function to generate a random 5-digit number
  async generateFiveRandomDigits(): Promise<string> {
    return Math.floor(10000 + Math.random() * 90000).toString(); // ensures 5 digits
  }
  // Function to generate a random 4-digit number
  async generateFourRandomDigits(): Promise<string> {
    return Math.floor(1000 + Math.random() * 9000).toString(); // ensures 4 digits
  }
  // Function to generate a random 2-digit number
  async generateTwoRandomDigits(): Promise<string> {
    return Math.floor(10 + Math.random() * 90).toString(); // ensures 2 digits
  }

  // Function to generate a random 5-character alphanumeric string
  async generateRandomString(): Promise<string> {
    return Math.random().toString(36).substring(2, 7); // generates 5 random characters
  }

  async generateNomenclatureName(modulename: string): Promise<string> {
    const randomDigits = await this.generateFiveRandomDigits();
    return "Automated_" + modulename + "_" + randomDigits;
  }

  async generateNomenclatureEditedName(modulename: string): Promise<string> {
    const randomDigits = await this.generateFiveRandomDigits();
    return "Automated_" + modulename + "_" + randomDigits + "_Edited";
  }

  async clickOnRandomOptionFromDropdown(
    dropdownElement: Locator
  ): Promise<void> {
    const options = await dropdownElement.locator("option").all();
    // Generate a random index to select an option
    const randomIndex = Math.floor(Math.random() * options.length);
    // Get the value of the random option
    const randomOptionValue = await options[randomIndex].getAttribute("value");
    if (!randomOptionValue) {
      throw new Error("Selected option does not have a valid value attribute.");
    }
    // Select the random option by its value
    await dropdownElement.selectOption(randomOptionValue);
  }

  async selectRandomItemFromMultiSelectList(
    listElement: Locator
  ): Promise<void> {
    // Wait for the list to be visible
    await listElement.first().waitFor({ state: "visible" });
    // Get all the list items
    const items = await listElement.all();
    // Generate a random index to select an item
    const randomIndex = Math.floor(Math.random() * items.length);
    // Click the random item
    await items[randomIndex].click();
  }

  async generateNomenclatureEmail(role: string) {
    const randomDigits = await this.generateFiveRandomDigits();
    return (
      // "Automated_" + role + "_" + randomDigits + "@team507472.testinator.com"
      "Automated_" + role + "_" + randomDigits + "@yopmail.com"
    );
  }

  // Login to Yopmail
  async yopmailLogin(email: string) {
    await this.navigateTo("https://yopmail.com/en/");
    await this.enterValuesInElement(
      this.page.locator("//input[@id='login']"),
      email
    );
    await this.page.waitForTimeout(3000);
    await this.page.keyboard.press("Enter");
  }

  //This method is for YopMail
  async openCreateAccountLinkFromEmail() {
    const iframeElement = this.page.frameLocator('iframe[name="ifmail"]');
    const createAccountLink = iframeElement.locator("a", {
      hasText: "Create Account",
    });

    // Navigate to the link's URL directly in the same tab
    const link = await createAccountLink.getAttribute("href");

    if (link) {
      await this.page.goto(link); // Directly navigate to the link's URL
    } else {
      throw new Error("Create account link not found");
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  // Yopmail method to open reset password link from email
  async openResetPasswordLinkFromEmail() {
    const iframeElement = this.page.frameLocator('iframe[name="ifmail"]');
    const resetPasswordLink = iframeElement.locator("a", {
      hasText: "Reset Password",
    });

    // Navigate to the link's URL directly in the same tab
    const link = await resetPasswordLink.getAttribute("href");

    if (link) {
      await this.page.goto(link); // Directly navigate to the link's URL
    } else {
      throw new Error("Reset password link not found");
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  async validateColumnData(elementList: Locator): Promise<void> {
    const elements = await elementList.all();
    for (const element of elements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }
  }

  async generateNomenclatureDescription(modulename: string): Promise<string> {
    const randomString = await this.generateRandomString();
    return "Automated_" + modulename + "_Description_" + randomString;
  }

  //Function to select random option from radio group
  async selectRandomRadioOption(radiogroup: Locator) {
    const options = await radiogroup.all();
    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1; // Ensure index is never 0
    await options[randomIndex].click();
  }

  // Function to generate a random future date in MM-DD-YYYY format
  async getRandomFutureDate(): Promise<string> {
    const currentDate = new Date();

    // Generate a random number of days in the future (up to 365 days)
    const daysInFuture = Math.floor(Math.random() * 365) + 1; // Between 1 and 365 days

    // Add the random number of days to the current date
    currentDate.setDate(currentDate.getDate() + daysInFuture);

    // Format the date as MM-DD-YYYY
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, "0"); // Day of the month
    const year = currentDate.getFullYear(); // Full year

    // Return the date in MM-DD-YYYY format
    return `${month}-${day}-${year}`;
  }
}
