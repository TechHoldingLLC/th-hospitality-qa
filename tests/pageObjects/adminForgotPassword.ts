import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminForgotPasswordPage extends BasePage {
  public resetpasswordLink: Locator;
  public emailInput: Locator;
  public resetPasswordButton: Locator;
  public resetLinkSentSuccessmessage: Locator;
  public mailinatorInboxField: Locator;
  public mailinatorGoBTN: Locator;
  public mailinatorLinksTab: Locator;
  public mailinatorResetPasswordButtonLink: Locator;
  public changePasswordButton: Locator;
  public newPasswordInput: Locator;
  public confirmPasswordInput: Locator;
  public passwordResetSuccessMessage: Locator;
  public mailinatorTimeList: Locator;
  public resetLinkInvalidText: Locator;
  public passwordFormatValidationMessage: Locator;
  public passwordBlankValidationMessage: Locator;
  public passwordNotMatchValidationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.resetpasswordLink = page.locator("//a[text()='Reset Password?']");
    this.emailInput = page.locator("//input[@name='email']");
    this.resetPasswordButton = page.locator(
      "//button[text()='Reset Password']"
    );
    this.resetLinkSentSuccessmessage = page.locator(
      "//div[@class='mb-4 flex flex-col items-center']"
    );

    this.mailinatorInboxField = page.locator("#inbox_field");
    this.mailinatorGoBTN = page.locator("//button[@class='primary-btn']");
    this.mailinatorLinksTab = page.locator("#pills-links-tab");
    this.mailinatorResetPasswordButtonLink = page.locator(
      "//td[text()='Reset Password']/following-sibling::td//a"
    );
    this.changePasswordButton = page.locator("//button[@type='submit']");
    this.newPasswordInput = page.locator("//input[@name='password']");
    this.confirmPasswordInput = page.locator(
      "//input[@name='repeat_password']"
    );
    this.passwordResetSuccessMessage = page.locator(
      "//span[text()='Password reset successful']"
    );
    this.mailinatorTimeList = page.locator(
      "//div[@class='block-received w-25 ng-binding']"
    );
    this.resetLinkInvalidText = page.locator(
      "//div[@class='mb-6 flex flex-col items-center']"
    );
    this.passwordFormatValidationMessage = page.locator(
      "//span[text()='The password should be an Alphanumeric having a minimum of 8 characters, with a minimum of one character in Uppercase and one special symbol with no space.']"
    );
    this.passwordBlankValidationMessage = page.locator(
      "//span[text()='String must contain at least 1 character(s)']"
    );
    this.passwordNotMatchValidationMessage = page.locator(
      "//span[text()='Passwords do no match']"
    );
  }

  async navigateToResetPaswordPageFromMailinatorInbox(): Promise<void> {
    await this.confirmNewEmailAndGoToBody("resetUser");
    await this.clickElement(this.mailinatorLinksTab);

    // Navigate to the link's URL directly in the same tab
    const link = await this.mailinatorResetPasswordButtonLink.getAttribute(
      "href"
    );

    if (link) {
      await this.page.goto(link); // Directly navigate to the link's URL
    } else {
      throw new Error("Reset password link not found");
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openResetPasswordLinkFromExpiredEmail(): Promise<void> {
    await this.enterValuesInElement(this.mailinatorInboxField, "resetUser");
    await this.clickElement(this.mailinatorGoBTN);
    await this.page.waitForTimeout(3000);
    await this.page
      .locator("//table[@class='table-striped jambo_table']//tr[4]")
      .click();

    await this.clickElement(this.mailinatorLinksTab);
    // Navigate to the link's URL directly in the same tab
    const link = await this.mailinatorResetPasswordButtonLink.getAttribute(
      "href"
    );

    if (link) {
      await this.page.goto(link); // Directly navigate to the link's URL
    } else {
      throw new Error("Reset password link not found");
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  async requestNewPassword(email: string): Promise<void> {
    //Navigate to Reset password page and request for new password
    await this.waitForElementVisible(this.resetpasswordLink);
    await this.clickElement(this.resetpasswordLink);
    await this.isElementVisible(this.resetPasswordButton);
    await this.enterValuesInElement(this.emailInput, email);
    await this.clickElement(this.resetPasswordButton);
    await this.page.waitForTimeout(5000);
  }
}
