import { Page, Locator } from "@playwright/test";

export default class BasePage {
  readonly page: Page;

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

  async waitForUpdateSuccessMsgToAppearAndHidden(): Promise<void> {
    const selector = 'text="Updated successfully."';
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.waitForSelector(selector, { state: "hidden" });
  }

  async waitForPageToBeReady(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async isElementVisible(element: Locator): Promise<boolean> {
    await this.page.waitForTimeout(3000);
    return await element.isVisible();
  }

  async getAllTextContents(element: Locator): Promise<string[]> {
    return await element.allTextContents();
  }

  // Function to generate a random 5-digit number
  async generateRandomDigits(): Promise<string> {
    return Math.floor(10000 + Math.random() * 90000).toString(); // ensures 5 digits
  }

  // Function to generate a random 5-character alphanumeric string
  async generateRandomString(): Promise<string> {
    return Math.random().toString(36).substring(2, 7); // generates 5 random characters
  }
  async waitForInvalidFieldsMsgToAppearAndHidden(): Promise<void> {
    const selector = 'text="Incorrect email or password. Please try again."';
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.waitForSelector(selector, { state: "hidden" });
  }
}
