import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import createAccountData from "../data/createAccountData.json";
import { createAccountPage } from "../pageObjects/createAccount";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createAccount: createAccountPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  createAccount = new createAccountPage(page);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0019 - Verify that users are prompted to enter the required fields and can finish creating an account", async () => {
  try {
    await basePage.openCreateAccountLinkFromEmail(
      createAccountData.adminInviteEmail
    );

    //Verify email field is pre-filled and non-editable
    await basePage.waitForElementVisible(createAccount.emailInput);
    const emailInputValue = await createAccount.emailInput.inputValue();
    expect(emailInputValue).toBe(createAccountData.adminInviteEmail);
    expect(await basePage.isElementDisabled(createAccount.emailInput)).toBe(
      true
    );

    //Verify validation error messages on Sign Up page
    await basePage.clickElement(createAccount.signUpButton);
    expect(
      await basePage.isElementVisible(createAccount.firstNameValidationMessage)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createAccount.lastNameValidationMessage)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createAccount.passwordFormatValidationMessage
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createAccount.confirmPasswordValidationMessage
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createAccount.countryValidationMessage)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createAccount.stateValidationMessage)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createAccount.cityValidationMessage)
    ).toBe(true);

    //Verify Password and confirm password mismatch validation
    await page.reload();
    await basePage.enterValuesInElement(
      createAccount.passwordInput,
      createAccountData.password
    );
    await basePage.enterValuesInElement(
      createAccount.confirmPasswordInput,
      "a"
    );
    await basePage.clickElement(createAccount.signUpButton);
    expect(
      await basePage.isElementVisible(
        createAccount.confirmPasswordValidationMessage
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0021 - Verify that users must provide all location fields if the user provides one", async () => {
  try {
    await basePage.openCreateAccountLinkFromEmail(
      createAccountData.adminInviteEmail
    );
    //Verify all location fields (City, State, Country) are required if one is provided.
    await basePage.enterValuesInElement(
      createAccount.cityInput,
      createAccountData["United States"].cityName
    );
    await basePage.clickElement(createAccount.signUpButton);
    expect(
      await basePage.isElementVisible(createAccount.locationValidationMessage)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0111 - Verify that Admin user is created successfully after registration process.", async () => {
  try {
    await basePage.openCreateAccountLinkFromEmail(
      createAccountData.adminInviteEmail
    );
    //Create account successfully
    await createAccount.createAccount(createAccountData.adminInviteEmail);
    expect(await basePage.isElementVisible(loginPage.loginButton)).toBe(true);
    //Verify login as newly registered admin
    await loginPage.login(
      createAccountData.adminInviteEmail,
      createAccountData.password
    );
    expect(await basePage.isElementVisible(loginPage.cokeLogo)).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0112 - Verify that Coordinator user is created successfully after registration process.", async () => {
  try {
    await basePage.openCreateAccountLinkFromEmail(
      createAccountData.coordinatorInviteEmail
    );
    //Create account successfully
    await createAccount.createAccount(createAccountData.coordinatorInviteEmail);
    expect(await basePage.isElementVisible(loginPage.loginButton)).toBe(true);
    await page.waitForLoadState();
    expect(page.url()).toEqual(createAccountData.expectedLoginBaseURL);

    //Verify login as newly registered coordinator
    await loginPage.login(
      createAccountData.coordinatorInviteEmail,
      createAccountData.password
    );
    expect(await basePage.isElementVisible(createAccount.shopUILogo)).toBe(
      true
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
