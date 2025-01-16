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

  async openResetPasswordLinkFromExpiredEmail(): Promise<void> {
    const iframeElement = this.page.frameLocator('iframe[name="ifinbox"]');
    const expiredEmail = await iframeElement.locator('button:has-text("Reset your EPICS event system password")').last().click();
    await this.openResetPasswordLinkFromEmail();
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
