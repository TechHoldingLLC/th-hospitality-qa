import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminCreateEditPackagePage } from "../pageObjects/adminCreateEditPackage";
import { config } from "../config/config.qa";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditPackagePage: adminCreateEditPackagePage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  createEditPackagePage = new adminCreateEditPackagePage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(createEditPackagePage.packagesButton);
  await basePage.clickElement(createEditPackagePage.addPackageButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0034 - Verify required and optional fields for packages", async () => {
  try {
    await basePage.clickElement(createEditPackagePage.productsTab);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageNameValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.associatedProgramValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageDescriptionValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.maxQuantityPerOrderValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createEditPackagePage.thumbnailValidation)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createEditPackagePage.mediaValidation)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test.only("TC0036 - Verify that user can add and remove products and update quantities", async () => {
  try {
    await createEditPackagePage.addPackage();

    await page.waitForTimeout(3000);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
