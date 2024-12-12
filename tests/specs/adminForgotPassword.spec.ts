import { Browser, Page, chromium, expect, test } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminForgotPasswordPage } from "../pageObjects/adminForgotPassword";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let forgotPasswordPage: adminForgotPasswordPage;
const resetUserEmail = 'resetUser@team507472.testinator.com';

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    basePage = new BasePage(page);
    forgotPasswordPage = new adminForgotPasswordPage(page);
    await basePage.navigateTo(config.adminPortalUrl);
});

test.afterEach(async () => {
    await browser.close();
});

test("TC0005 - Verify that the user can access a screen to enter their email address to initiate a reset", async () => {
    await basePage.waitForElementVisible(forgotPasswordPage.resetpasswordLink);
    await basePage.clickElement(forgotPasswordPage.resetpasswordLink);
    expect(await basePage.isElementVisible(forgotPasswordPage.resetPasswordButton)).toBe(true);
    await basePage.enterValuesInElement(forgotPasswordPage.emailInput, resetUserEmail);
    await basePage.clickElement(forgotPasswordPage.resetPasswordButton);
    expect(await basePage.isElementVisible(forgotPasswordPage.resetLinkSentSuccessmessage)).toBe(true);
});

test.only("TC0007 - Verify that the user should receive an email with a one-time link to access the password reset page", async () => {
    await basePage.waitForElementVisible(forgotPasswordPage.resetpasswordLink);
    await basePage.clickElement(forgotPasswordPage.resetpasswordLink);
    expect(await basePage.isElementVisible(forgotPasswordPage.resetPasswordButton)).toBe(true);
    await basePage.waitForElementVisible(forgotPasswordPage.emailInput);
    await basePage.enterValuesInElement(forgotPasswordPage.emailInput, resetUserEmail);
    console.log('value entered:',await forgotPasswordPage.emailInput.getAttribute('value'));
    await basePage.clickElement(forgotPasswordPage.resetPasswordButton);
    expect(await basePage.isElementVisible(forgotPasswordPage.resetLinkSentSuccessmessage)).toBe(true);
    await forgotPasswordPage.mailinatorLogin();
    const newTab = await forgotPasswordPage.navigateToResetPaswordPageFromMailinatorInbox();
    //expect(await basePage.isElementVisible(forgotPasswordPage.changePasswordButton)).toBe(true);
    await newTab.waitForSelector('//button[@type="submit"]', { state: 'visible' });

    await page.waitForTimeout(3000);
});