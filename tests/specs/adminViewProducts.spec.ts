import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminViewProductsPage } from "../pageObjects/adminViewProducts";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewProductsPage: adminViewProductsPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  viewProductsPage = new adminViewProductsPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewProductsPage.productsButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0022 - Verify that users can view a list of products", async () => {
  try {
    //Verify navigation to Products Listing page
    expect(
      await basePage.isElementVisible(viewProductsPage.addProductButton)
    ).toBe(true);

    //Verify that the Products list displays expected columns
    expect(
      await basePage.isElementVisible(viewProductsPage.productNameHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewProductsPage.productTypeHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewProductsPage.programNameHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewProductsPage.eventNameHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewProductsPage.dateRangeHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewProductsPage.noOfPackagesHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewProductsPage.totalQuantityHeader)
    ).toBe(true);

    //Verify Product Name column data
    await basePage.validateColumnData(viewProductsPage.productNameColumnData);

    //Verify Product Type column data
    await basePage.validateColumnData(viewProductsPage.productTypeColumnData);

    //Verify Program Name column data
    await basePage.validateColumnData(viewProductsPage.programNameColumnData);

    //Verify Event Name column data
    await basePage.validateColumnData(viewProductsPage.eventNameColumnData);

    //Verify Date range column data
    await basePage.validateColumnData(viewProductsPage.dateRangeColumnData);

    //Verify # of Packages column data
    await basePage.validateColumnData(viewProductsPage.noOfPackagesColumnData);

    //Verify Total Quantity column data
    await basePage.validateColumnData(viewProductsPage.totalQuantityColumnData);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0024 - Verify the CTAs to create edit and delete products are available", async () => {
  try {
    //Verify navigation to Create Product page
    await basePage.clickElement(viewProductsPage.addProductButton);
    expect(
      await basePage.isElementVisible(viewProductsPage.addProductForm)
    ).toBe(true);
    await page.keyboard.press("Escape");

    //Verify navigation to Edit product page
    await basePage.clickElement(viewProductsPage.kebabMenu);
    await basePage.clickElement(viewProductsPage.editButton);
    expect(await basePage.isElementVisible(viewProductsPage.editProductHeader));
    await basePage.clickElement(viewProductsPage.cancelButton);
    await basePage.clickElement(viewProductsPage.productsButton.first());

    //Verify navigation to Delete product page
    await basePage.clickElement(viewProductsPage.kebabMenu);
    await basePage.clickElement(viewProductsPage.deleteButton);
    expect(
      await basePage.isElementVisible(viewProductsPage.confirmDeleteButton)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test.only("TC0023 - Verify that users can filter on type and program", async () => {
  try {
    // click on Add filter button
    await basePage.clickElement(viewProductsPage.addFilterButton);

    // click on Type menu item
    await basePage.clickElement(viewProductsPage.typeMenuItem);

    // select random product from list
    const selectedProductType: null | string =
      await basePage.selectRandomItemFromMultiSelectList(
        viewProductsPage.productListFromTypeMenuItem
      );

    if (selectedProductType === null) {
      expect(
        selectedProductType,
        "Null value found while retrieving the text of the selected product."
      ).not.toBeNull();
    } else {
      // Get Product Type column data locators
      const productTypeColumnLocator = await basePage.getColumnDataLocators(
        "Product Type"
      );

      expect(productTypeColumnLocator.length).toBeGreaterThan(0);

      // Iterate through rowData to validate each cell's content
      for (const rowLocator of productTypeColumnLocator) {
        const cellText = await basePage.getElementTextContent(rowLocator);

        // Validate each row's textContent
        expect(cellText).toEqual(selectedProductType.toString());
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
