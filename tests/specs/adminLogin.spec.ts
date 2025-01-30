import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let basePage: BasePage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  await basePage.navigateTo(config.adminPortalUrl);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0001 - Verify that users are presented with a login page", async () => {
  try {
    // Verify that Login Form Inputs are visible
    await basePage.isElementVisible(loginPage.emailInput);
    await basePage.isElementVisible(loginPage.passwordInput);
    await basePage.isElementVisible(loginPage.loginButton);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
test("TC0002 - Verify that users can enter their credentials", async () => {
  try {
    // Fill up Login Form
    await basePage.enterValuesInElement(loginPage.emailInput, config.email);
    await basePage.enterValuesInElement(
      loginPage.passwordInput,
      config.password
    );
    // Retrieve entered values and verify them
    const enteredEmail = await loginPage.getEnteredEmail();
    const enteredPassword = await loginPage.getEnteredPassword();
    expect(enteredEmail).toBe(config.email);
    expect(enteredPassword).toBe(config.password);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
test("TC0003 - Verify that admins who have appropriate access can access the system", async () => {
  try {
    await loginPage.login(config.email, config.password);
    // Verify that the admin portal's cokeLogo is visible
    await basePage.isElementVisible(loginPage.cokeLogo);
    expect(await basePage.isElementVisible(loginPage.cokeLogo)).toBe(true);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});
test("TC0004 - Verify that non-admins - those without appropriate access - cannot access the system.", async () => {
  try {
    const incorrectPassword = "Test@@123";
    const errorMessage = "Incorrect email or password. Please try again.";
    // Fill up Login Form
    await basePage.enterValuesInElement(loginPage.emailInput, config.email);
    await basePage.enterValuesInElement(
      loginPage.passwordInput,
      incorrectPassword
    );
    await basePage.clickElement(loginPage.loginButton);
    // Verify that an error message is displayed
    const errorMessageText: string | null = await basePage.getElementText(
      loginPage.errorMessage
    );
    expect(errorMessageText).toEqual(errorMessage);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});
