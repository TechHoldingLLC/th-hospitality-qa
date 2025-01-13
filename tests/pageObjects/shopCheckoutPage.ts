import { Browser, Locator, Page, expect } from "@playwright/test";
import BasePage from "./basePage";

export class shopCheckoutPage extends BasePage {
  public approvingManagerNameField: Locator;
  public approvingManagerEmailField: Locator;
  public requestedPackagesField: Locator;
  public intendedInviteeCategoryDropdown: Locator;
  public orderPurposeDropdown: Locator;
  public submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.approvingManagerNameField = page.locator(
      "//input[@name='approving_manager_name']"
    );
    this.approvingManagerEmailField = page.locator(
      "//input[@name='approving_manager_email']"
    );
    this.requestedPackagesField = page.locator(
      "//input[@name='intended_business_use']"
    );
    this.intendedInviteeCategoryDropdown = page.locator(
      "//label[text()='Intended Invitee Category']/following-sibling::select"
    );
    this.orderPurposeDropdown = page.locator(
      "//label[text()='Order Purpose']/following-sibling::select"
    );
    this.submitButton = page.locator("//button[@aria-label='Submit Checkout']");
  }

  async getErrorMessageElementForFields(elementName: string) {
    return `//label[text()='${elementName}']/following-sibling::span[contains(@class,'text-red')]`;
  }
}
