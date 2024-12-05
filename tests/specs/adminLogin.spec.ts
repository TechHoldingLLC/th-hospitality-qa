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
  await page.setViewportSize({ width: 1920, height: 1080 });
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0001 - Verify that users are presented with a login page", async () => {
  try {
    // Navigate to the Admin Portal
    await basePage.navigateTo(config.adminPortalUrl);
    // Verify that email input, password input, and login button are visible
    await page.waitForTimeout(3000);
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
    // Navigate to the Admin Portal
    await basePage.navigateTo(config.adminPortalUrl);
    // Enter email and password
    await basePage.enterValuesInElement(loginPage.emailInput, config.email);
    await basePage.enterValuesInElement(loginPage.passwordInput, config.password);
    // Click the login button
    await basePage.clickElement(loginPage.loginButton);
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
    await basePage.navigateTo(config.adminPortalUrl);
    // Enter valid email and password
    await basePage.enterValuesInElement(loginPage.emailInput, config.email);
    await basePage.enterValuesInElement(loginPage.passwordInput, config.password);
    // Click the login button
    await basePage.clickElement(loginPage.loginButton);
    await page.waitForTimeout(5000);
    // Verify that the admin portal's cokeLogo is visible
    await basePage.isElementVisible(loginPage.cokeLogo);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});
test("TC0004 - Verify that non-admins - those without appropriate access - cannot access the system.", async () => {
  try {
    await basePage.navigateTo(config.adminPortalUrl);
    // Enter Valid Email and Invalid Password
    await basePage.enterValuesInElement(loginPage.emailInput, config.email);
    await basePage.enterValuesInElement(loginPage.passwordInput, config.incorrectPassword);
    // Click the login button
    await basePage.clickElement(loginPage.loginButton);
    // Verify that an error message is displayed
    await basePage.getElementText(loginPage.errorMessage);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

