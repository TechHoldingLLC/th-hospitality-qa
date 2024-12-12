import { Browser, Page, chromium, expect, test } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminForgotPasswordPage } from "../pageObjects/adminForgotPassword";
import { adminLoginPage } from "../pageObjects/adminLoginPage";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let forgotPasswordPage: adminForgotPasswordPage;
let loginPage: adminLoginPage;
const resetUserEmail = "resetUser@team507472.testinator.com";
let newPassword: any;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  forgotPasswordPage = new adminForgotPasswordPage(page);
  loginPage = new adminLoginPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  newPassword = await basePage.generateNomenclatureName("Password");
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0005 - Verify that the user can access a screen to enter their email address to initiate a reset", async () => {
  try {
    //Navigate to Reset password page and request for new password
    await basePage.waitForElementVisible(forgotPasswordPage.resetpasswordLink);
    await basePage.clickElement(forgotPasswordPage.resetpasswordLink);
    expect(
      await basePage.isElementVisible(forgotPasswordPage.resetPasswordButton)
    ).toBe(true);
    await basePage.waitForElementVisible(forgotPasswordPage.emailInput);
    await basePage.enterValuesInElement(
      forgotPasswordPage.emailInput,
      resetUserEmail
    );
    const enteredEmail = await forgotPasswordPage.emailInput.getAttribute(
      "value"
    );
    expect(enteredEmail).toEqual(resetUserEmail);
    await basePage.clickElement(forgotPasswordPage.resetPasswordButton);
    expect(
      await basePage.isElementVisible(
        forgotPasswordPage.resetLinkSentSuccessmessage
      )
    ).toBe(true);

    //Login into email domian
    await basePage.mailinatorLogin();
    //Check for new received email and click on link received for 'Reset Password'
    await forgotPasswordPage.navigateToResetPaswordPageFromMailinatorInbox();
    expect(
      await basePage.isElementVisible(forgotPasswordPage.changePasswordButton)
    ).toBe(true);

    await basePage.clickElement(forgotPasswordPage.changePasswordButton);
    //Verify validation for password format
    expect(
      await basePage.isElementVisible(
        forgotPasswordPage.passwordFormatValidationMessage
      )
    ).toBe(true);
    //Verify validation for empty password field
    expect(
      await basePage.isElementVisible(
        forgotPasswordPage.passwordBlankValidationMessage
      )
    ).toBe(true);

    //Verify passwords do not match validation message
    await basePage.enterValuesInElement(
      forgotPasswordPage.newPasswordInput,
      newPassword
    );
    await basePage.enterValuesInElement(
      forgotPasswordPage.confirmPasswordInput,
      "a"
    );
    expect(
      await basePage.isElementVisible(
        forgotPasswordPage.passwordNotMatchValidationMessage
      )
    ).toBe(true);

    //Create new password
    await basePage.enterValuesInElement(
      forgotPasswordPage.newPasswordInput,
      newPassword
    );
    await basePage.enterValuesInElement(
      forgotPasswordPage.confirmPasswordInput,
      newPassword
    );
    await basePage.clickElement(forgotPasswordPage.changePasswordButton);
    expect(
      await basePage.isElementVisible(
        forgotPasswordPage.passwordResetSuccessMessage
      )
    ).toBe(true);
    expect(await basePage.isElementVisible(loginPage.loginButton)).toBe(true);

    //Verify login with newly created password
    await loginPage.login(resetUserEmail, newPassword);
    await basePage.isElementVisible(loginPage.cokeLogo);
    expect(await basePage.isElementVisible(loginPage.cokeLogo)).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0008 - Verify that 'Reset Password' link gets expire after 15 minute post generated", async () => {
  try {
    //Login into email domian
    await basePage.mailinatorLogin();
    //Open email with expired link and click on link
    await forgotPasswordPage.openResetPasswordLinkFromExpiredEmail();
    await basePage.waitForElementVisible(
      forgotPasswordPage.resetLinkInvalidText
    );
    //Verify 'Link is invalid' message is displayed
    expect(
      await basePage.isElementVisible(forgotPasswordPage.resetLinkInvalidText)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
