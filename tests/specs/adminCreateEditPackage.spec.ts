import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminCreateEditPackagePage } from "../pageObjects/adminCreateEditPackage";
import { config } from "../config/config.qa";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";

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
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0034 - Verify required and optional fields for packages", async () => {
  try {
    await basePage.clickElement(createEditPackagePage.packagesButton);
    await basePage.clickElement(createEditPackagePage.addPackageButton);
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

test("TC0036 - Verify that user can add and remove products and update quantities", async () => {
  try {
    const maxQuantity = await createEditPackagePage.addPackageDetailsForm();
    await createEditPackagePage.addPackageProductForm(maxQuantity);
    expect(
      await createEditPackagePage.inPackageQuantityInput.inputValue()
    ).not.toEqual("0");
    await basePage.clickElement(createEditPackagePage.deleteProductIcon);
    expect(
      await basePage.isElementDisabled(createEditPackagePage.submitButton)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0035 - Verify that the user is able to create a package", async () => {
  try {
    await createEditPackagePage.addPackage();
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageCreationSuccessMessage
      )
    ).toBe(true);
    await page.waitForTimeout(3000);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
