import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminViewPackagesPage } from "../pageObjects/adminViewPackages";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewPackagesPage: adminViewPackagesPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  viewPackagesPage = new adminViewPackagesPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewPackagesPage.packagesButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0030 - Verify that users can view a list of packages", async () => {
  try {
    //Verify navigation to Packages Listing page
    expect(
      await basePage.isElementVisible(viewPackagesPage.addpackageButton)
    ).toBe(true);

    //Verify that the Packages list displays expected columns
    expect(
      await basePage.isElementVisible(viewPackagesPage.packageNameLabel)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewPackagesPage.associatedProgramLabel)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewPackagesPage.productsLabel)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewPackagesPage.departmentLabel)
    ).toBe(true);
    expect(await basePage.isElementVisible(viewPackagesPage.groupsLabel)).toBe(
      true
    );
    expect(await basePage.isElementVisible(viewPackagesPage.priceLabel)).toBe(
      true
    );
    expect(
      await basePage.isElementVisible(viewPackagesPage.quantityAvailableLabel)
    ).toBe(true);

    //Verify Package Name column data
    await basePage.validateColumnData(viewPackagesPage.packageNameColumnData);

    //Verify Associated program column data
    await basePage.validateColumnData(
      viewPackagesPage.associatedProgramColumnData
    );

    //Verify Products column data
    await basePage.validateColumnData(viewPackagesPage.productsColumnData);

    //Verify Department column data
    await basePage.validateColumnData(viewPackagesPage.departmentColumnData);

    //Verify Groups column data
    await basePage.validateColumnData(viewPackagesPage.groupsColumnData);

    //Verify Price column data
    await basePage.validateColumnData(viewPackagesPage.priceColumnData);

    //Verify Quantity Available column data
    await basePage.validateColumnData(
      viewPackagesPage.quantityAvailableColumnData
    );
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0032 - Verify the CTAs to create edit and delete packages are available", async () => {
  try {
    //Verify navigation to Create Package page
    await basePage.clickElement(viewPackagesPage.addpackageButton);
    expect(
      await basePage.isElementVisible(viewPackagesPage.addPackageForm)
    ).toBe(true);
    await page.keyboard.press("Escape");

    //Verify navigation to Edit Package page
    await basePage.clickElement(viewPackagesPage.kebabMenu);
    await basePage.clickElement(viewPackagesPage.editButton);
    expect(
      await basePage.isElementVisible(viewPackagesPage.editPackageHeader)
    ).toBe(true);
    await page.keyboard.press("Escape");
    await basePage.clickElement(viewPackagesPage.packagesButton.first());

    //Verify navigation to Delete Package page
    await basePage.clickElement(viewPackagesPage.kebabMenu);
    await basePage.clickElement(viewPackagesPage.deleteButton);
    expect(
      await basePage.isElementVisible(viewPackagesPage.confirmDeleteButton)
    ).toBe(true);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});
