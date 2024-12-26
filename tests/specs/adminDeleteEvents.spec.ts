import { test, Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminViewEventsPage } from "../pageObjects/adminViewEvents";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewEventsPage: adminViewEventsPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1792, height: 1080 });
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  viewEventsPage = new adminViewEventsPage(page);
  //Navigation to admin portal
  await basePage.navigateTo(config.adminPortalUrl);
  //Login
  await loginPage.login(config.email, config.password);
  //Navigation to evets Listing page
  await basePage.clickElement(viewEventsPage.eventsButton);
});

test.afterEach(async () => {
  await browser.close();
});

test('TC0083 - Verify that the user can access a CTA to delete', async()=>{
    try {
        
        
    } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
    }

});

