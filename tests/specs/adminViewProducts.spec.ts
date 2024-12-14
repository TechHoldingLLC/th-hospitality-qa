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
    const productNameElements =
      await viewProductsPage.productNameColumnData.all();
    for (const element of productNameElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }

    //Verify Product Type column data
    const productTypeElements =
      await viewProductsPage.productTypeColumnData.all();
    for (const element of productTypeElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }

    //Verify Program Name column data
    const programNameElements =
      await viewProductsPage.programNameColumnData.all();
    for (const element of programNameElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }

    //Verify Event Name column data
    const eventNameElements = await viewProductsPage.eventNameColumnData.all();
    for (const element of eventNameElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }

    //Verify Date range column data
    const dateRangeElements = await viewProductsPage.dateRangeColumnData.all();
    for (const element of dateRangeElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }

    //Verify # of Packages column data
    const noOfPackagesElements =
      await viewProductsPage.noOfPackagesColumnData.all();
    for (const element of noOfPackagesElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }

    //Verify Total Quantity column data
    const totalQuantityElements =
      await viewProductsPage.totalQuantityColumnData.all();
    for (const element of totalQuantityElements) {
      const textContent = await element.textContent();
      expect(textContent).toBeTruthy();
    }
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
