import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminCreateEditPackagePage } from "../pageObjects/adminCreateEditPackage";
import { config } from "../config/config.qa";
import { adminCreateEditProductPage } from "../pageObjects/adminCreateEditProduct";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditPackagePage: adminCreateEditPackagePage;
let createEditProductPage: adminCreateEditProductPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  createEditPackagePage = new adminCreateEditPackagePage(page);
  createEditProductPage = new adminCreateEditProductPage(page);
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
    // Generate validations on screen
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
        createEditPackagePage.noOfGuestsValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.totalQuantityAvailableValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.maxQuantityPerOrderValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.currencyAndPriceValidation
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
    const packagename = await basePage.generateNomenclatureName("Package");
    await createEditPackagePage.addPackageDetailsForm(packagename);
    await createEditPackagePage.addPackageProductForm();
    // Verify user is able to update quantity
    expect(
      await createEditPackagePage.inPackageQuantityInput.inputValue()
    ).not.toEqual("0");
    // Verify user is able to remove product
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
    const packagename = await basePage.generateNomenclatureName("Package");
    await createEditPackagePage.addPackage(packagename);
    // Verify package created successfully
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageCreationSuccessMessage
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0033 - Verify that the user is able to create and edit packages",async()=>{
  try {
    // Create new package flow
    const packagename = await basePage.generateNomenclatureName("Package");
    await createEditPackagePage.addPackage(packagename);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageCreationSuccessMessage
      )
    ).toBe(true);

    // Edit package which just got created
    await basePage.clickElement(await createEditPackagePage.createdPackageKebabIconLocator(packagename));
    await basePage.clickElement(createEditPackagePage.editButton);
    await basePage.clickElement(createEditPackagePage.nextButton);

    // Create new product while editing package
    await basePage.clickElement(createEditPackagePage.addNewProductButton);
    await basePage.clickElement(createEditPackagePage.continueButton);
    const productNameFromPackage = await createEditPackagePage.generateNomenclatureProductNameFromPackage();
    await createEditPackagePage.createProductUnderPackage(productNameFromPackage);
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productNameFromPackage)
        )
      )
    ).toBe(true);

    // Add newly created product to package
    await createEditPackagePage.addCreatedProductToPackage(productNameFromPackage);

    // Save edited package
    await basePage.clickElement(createEditPackagePage.submitButton);

    // Verify package updated successfully
    expect(await basePage.isElementVisible(createEditPackagePage.packageUpdateMessage)).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});