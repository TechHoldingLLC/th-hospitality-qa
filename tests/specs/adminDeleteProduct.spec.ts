import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProductPage } from "../pageObjects/adminCreateEditProduct";
import { adminDeleteProductPage } from "../pageObjects/adminDeleteProduct";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditProductPage: adminCreateEditProductPage;
let deleteProductPage: adminDeleteProductPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  deleteProductPage = new adminDeleteProductPage(page);
  createEditProductPage = new adminCreateEditProductPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(createEditProductPage.productsButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0092 - Verify that an admin can successfully delete a product that is not associated with packages or event.", async () => {
  try {
    // Create a product and validate its successful creation.
    await basePage.clickElement(createEditProductPage.addProductButton);
    const productName = await createEditProductPage.createProductWithGift();
    await basePage.waitForPageToBeReady();
    expect(
      await basePage.isElementVisible(
        page.locator(
          await createEditProductPage.getProductCreatedLocator(productName)
        )
      )
    ).toBe(true);
    await basePage.enterValuesInElement(
      deleteProductPage.searchInput,
      productName
    );
    await deleteProductPage.openDeletePopupByProductName(productName);
    expect(
      await basePage.isElementVisible(
        await deleteProductPage.getDeleteConfirmationLocator(productName)
      )
    ).toBe(true);

    // Validate the success message after deleting the product.
    await basePage.clickElement(deleteProductPage.deleteProductButton);
    expect(
      await basePage.isElementVisible(
        await deleteProductPage.getDeleteSuccessLocator(productName)
      )
    ).toBe(true);

    // Validate that the product has been successfully deleted.
    await basePage.clickElement(deleteProductPage.confirmationButton);
    expect(
      await basePage.isElementVisible(deleteProductPage.getNoResultsMessage)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0093 - Verify that if the product is not associated with orders a confirmation prompt appears.", async () => {
  try {
    const verifyAlertDialogVisibleAndHidden = async () => {
      expect(
        await basePage.isElementVisible(deleteProductPage.alertDialog)
      ).toBe(true);
      expect(
        await basePage.isElementVisible(
          deleteProductPage.deleteConfirmationMessageLabel
        )
      ).toBe(true);
      await basePage.clickElement(deleteProductPage.cancelProductButton);
      await basePage.waitForElementHidden(deleteProductPage.alertDialog);
      expect(await deleteProductPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deleteProductPage.openDeletePopupRandomly();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deleteProductPage.openDeletePopupRandomly();
    await verifyAlertDialogVisibleAndHidden();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0094 - Verify that if the product is associated with orders or package an error message appears", async () => {
  try {
    await deleteProductPage.deleteReferredProduct();

    expect(
      await basePage.isElementVisible(
        deleteProductPage.failedToDeleteProductLabel
      )
    ).toBe(true);

    expect(
      await basePage.getElementText(deleteProductPage.alertDialog)
    ).not.toBeNull();
    expect(
      await basePage.isElementVisible(deleteProductPage.getFailedMessage)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
