import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminForgotPasswordPage } from "../pageObjects/adminForgotPassword";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let forgotPasswordPage: adminForgotPasswordPage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1380, height: 950 });
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
});