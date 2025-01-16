import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProductPage } from "../pageObjects/adminCreateEditProduct";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditProductPage: adminCreateEditProductPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  createEditProductPage = new adminCreateEditProductPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(createEditProductPage.productsButton);
  await basePage.clickElement(createEditProductPage.addProductButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0028 - Verify that the user is able to create a product - with Gift", async () => {
  try {
    const productname = await createEditProductPage.createProductWithGift();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0028 - Verify that the user is able to create a product - with Ticket", async () => {
  try {
    const productname = await createEditProductPage.createProductWithTicket();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0028 - Verify that the user is able to create a product - with Accommodation", async () => {
  try {
    const productname =
      await createEditProductPage.createProductWithAccommodation();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0028 - Verify that the user is able to create a product - with Airport Transfer", async () => {
  try {
    const productname =
      await createEditProductPage.createProductWithAirportTransfer();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0028 - Verify that the user is able to create a product - with Parking", async () => {
  try {
    const productname = await createEditProductPage.createProductWithParking();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0028 - Verify that the user is able to create a product - with Other", async () => {
  try {
    const productname = await createEditProductPage.createProductWithOther();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0029 - Verify that created/edit products appear updated in the products list", async () => {
  try {
    const productname = await createEditProductPage.createProductWithOther();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
    await basePage.waitForElementHidden(
      page.locator(
        await createEditProductPage.getProductCreatedLocator(productname)
      )
    );
    const createdProductLocator = page.locator(`text=${productname}`).first();
    expect(await basePage.getElementText(createdProductLocator)).toEqual(
      productname
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0027 - Verify required and optional fields", async () => {
  try {
    await basePage.clickElement(createEditProductPage.saveButton);
    expect(
      await basePage.isElementVisible(
        createEditProductPage.productNameValidation
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0026 - Verify that the user can create and edit products", async () => {
  try {
    const productname = await createEditProductPage.createProductWithGift();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productname)
        )
      )
    ).toBe(true);
    await basePage.waitForElementHidden(
      page.locator(
        await createEditProductPage.getProductCreatedLocator(productname)
      )
    );
    const createdProductLocator = page.locator(`text=${productname}`).first();
    expect(await basePage.getElementText(createdProductLocator)).toEqual(
      productname
    );
    await basePage.clickElement(
      page.locator(
        await createEditProductPage.getCreatedProductKebabIcon(productname)
      )
    );
    await basePage.clickElement(createEditProductPage.editProduct);
    await basePage.enterValuesInElement(
      createEditProductPage.productDescriptionInput,
      await createEditProductPage.generateNomenclatureDescription("Product")
    );
    await basePage.clickElement(createEditProductPage.saveButton);
    expect(
      await basePage.isElementVisible(
        createEditProductPage.productUpdateSuccessMessage
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
