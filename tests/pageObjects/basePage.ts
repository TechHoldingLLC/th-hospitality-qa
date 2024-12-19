import { Page, Locator, expect } from "@playwright/test";
import { config } from "../config/config.qa";

export default class BasePage {
  readonly page: Page;
  createAccountLink: any;
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

  async waitForUpdateSuccessMsgToAppearAndHidden(): Promise<void> {
    const selector = 'text="Updated successfully."';
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.waitForSelector(selector, { state: "hidden" });
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

  async generateNomenclatureName(modulename: string): Promise<string> {
    const randomDigits = await this.generateRandomDigits();
    return "Automated_" + modulename + "_" + randomDigits;
  }

  async generateNomenclatureEditedName(modulename: string): Promise<string> {
    const randomDigits = await this.generateRandomDigits();
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

  async mailinatorLogin(): Promise<void> {
    await this.navigateTo("https://www.mailinator.com/v4/login.jsp");
    await this.page.locator("#many_login_email").fill(config.email);
    await this.page.locator("#many_login_password").fill("QAteam@2024");
    await this.page.locator("//a[@class='btn btn-default submit']").click();
  }

  async generateNomenclatureEmail(role: string) {
    const randomDigits = await this.generateRandomDigits();
    return (
      // "Automated_" + role + "_" + randomDigits + "@team507472.testinator.com"
      "Automated_" + role + "_" + randomDigits + "@yopmail.com"
    );
  }

  //This method is for mailinator
  async confirmNewEmailAndGoToBody(email: string): Promise<void> {
    await this.page.waitForTimeout(5000);
    await this.enterValuesInElement(this.page.locator("#inbox_field"), email);
    await this.clickElement(
      this.page.locator("//button[@class='primary-btn']")
    );
    const emailTimestamp = await this.page
      .locator("//table[@class='table-striped jambo_table']//tr[1]//td[5]")
      .textContent();
    if (emailTimestamp?.trim() === "just now") {
      await this.clickElement(
        this.page.locator("//table[@class='table-striped jambo_table']//tr[1]")
      );
    } else {
      console.log("Email not received yet. Reloading the page...");
      await this.page.waitForTimeout(3000);
      await this.page.reload();
      await this.page.waitForLoadState("domcontentloaded");
      const updatedEmailTimestamp = await this.page
        .locator("//table[@class='table-striped jambo_table']//tr[1]//td[5]")
        .textContent();
      if (updatedEmailTimestamp?.trim() === "just now") {
        await this.clickElement(
          this.page.locator(
            "//table[@class='table-striped jambo_table']//tr[1]"
          )
        );
      } else {
        console.log("No new email received after reload.");
        throw new Error("No new email received after reload.");
      }
    }
  }

  //This method is for YopMail
  async openCreateAccountLinkFromEmail(email: string) {
    await this.navigateTo("https://yopmail.com/en/");
    await this.enterValuesInElement(
      this.page.locator("//input[@id='login']"),
      email
    );
    await this.page.keyboard.press("Enter");
    // Locate the iframe by its name attribute
    const iframeElement = this.page.frameLocator('iframe[name="ifmail"]');
    // Wait for the "Create Account" link to be visible and click it
    const createAccountLink = iframeElement.locator("a", {
      hasText: "Create Account",
    });

    // Navigate to the link's URL directly in the same tab
    const link = await createAccountLink.getAttribute("href");

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
}
