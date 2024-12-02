import { Browser, Page, chromium, test } from "@playwright/test";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";

let browser: Browser;
let page: Page;
let viewProgramsPage: adminViewProgramsPage;
let loginPage: adminLoginPage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    viewProgramsPage = new adminViewProgramsPage(page);
    loginPage = new adminLoginPage(page);
});

test.afterEach(async () => {
    await browser.close();
});

test("Verify navigation to View Programs page", async () => {
    try {
        await loginPage.navigate(config.adminPortalUrl);
        await page.waitForTimeout(3000);
        await loginPage.login(config.email, config.password);
        await page.waitForTimeout(3000);
        await viewProgramsPage.clickProgramsButton();
        await page.waitForTimeout(3000);
    } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
    }
});