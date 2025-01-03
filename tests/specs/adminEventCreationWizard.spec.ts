import test, { Browser, Page, chromium } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminEventCreationWizardpage } from "../pageObjects/adminEventCreationWizard";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let eventCreationWizardPage: adminEventCreationWizardpage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  eventCreationWizardPage = new adminEventCreationWizardpage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(eventCreationWizardPage.eventsButton);
  await basePage.clickElement(eventCreationWizardPage.addEventButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("", async () => {
  const eventName = await basePage.generateNomenclatureName("Event");
  await eventCreationWizardPage.createEvent(eventName);
  await page.waitForTimeout(3000);
});
