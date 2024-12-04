import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  loginPage = new adminLoginPage(page);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0001 - Verify that users are presented with a login page", async () => {
  try {
    // Navigate to the Admin Portal
    await loginPage.navigate(config.adminPortalUrl);
    // Verify that the login Page is visible
    await page.waitForTimeout(3000);
    const isVisible = await loginPage.isLoginPageVisible();
    expect(isVisible).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
test("TC0002 - Verify that users can enter their credentials", async () => {
  try {
    await loginPage.navigate(config.adminPortalUrl);
    await loginPage.enterEmail(config.email);
    await loginPage.enterPassword(config.password);
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
    await loginPage.navigate(config.adminPortalUrl);
    await loginPage.login(config.email, config.password);
    await page.waitForTimeout(5000);
    expect(await loginPage.isCokeLogoVisible()).toBe(true);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});
test("TC0004 - Verify that non-admins - those without appropriate access - cannot access the system.", async () => {
  try {
    await loginPage.navigate(config.adminPortalUrl);
    // Enter Valid Email and Invalid Password
    await loginPage.loginInvalid(config.email, config.incorrectPassword);
    // Validate the Error message
    const message: string | null = await loginPage.getErrorMessage();
    expect(message).toEqual(config.errorMessage);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

