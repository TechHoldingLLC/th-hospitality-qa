import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProductPage } from "../pageObjects/adminCreateEditProduct";
import { adminDeleteProductPage } from "../pageObjects/adminDeleteProduct";
import deleteProductData from "../data/deleteProductData.json";

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
    // Create and validate product.
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
    await basePage.waitForElementVisible(
      await deleteProductPage.menuButtonByProductName(productName)
    );
    expect(
      await basePage.getElementText(deleteProductPage.productInputText.first())
    ).toEqual(productName);

    // Validate delete product confirmation.
    await deleteProductPage.openDeletePopup();
    await basePage.waitForPageToBeReady();
    expect(
      await basePage.getElementText(deleteProductPage.deleteMessageLabel)
    ).toEqual(
      `${deleteProductData.expectedDeleteConfirmationMessage} "${productName}" ${deleteProductData.deleteConfirmationSuffix}`
    );

    // Validate delete product success message.
    await basePage.clickElement(deleteProductPage.deleteProductButton);
    await basePage.waitForElementVisible(
      deleteProductPage.deletedSuccessStatus
    );
    expect(
      await basePage.getElementText(deleteProductPage.deleteMessageLabel.last())
    ).toEqual(
      `${productName} ${deleteProductData.expectedDeleteSuccessMessage}`
    );

    // Validate product delete successfully.
    await basePage.clickElement(deleteProductPage.confirmationButton);
    expect(
      await basePage.getElementText(deleteProductPage.noResultsMessageContainer)
    ).toContain(deleteProductData.expectedErrorMessages);
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
        await basePage.getElementText(deleteProductPage.deleteMessageLabel)
      ).toContain(deleteProductData.expectedDeleteConfirmationMessage);
      await basePage.clickElement(deleteProductPage.cancelProductButton);
      await deleteProductPage.alertDialog.waitFor({ state: "hidden" });
      expect(await deleteProductPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deleteProductPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deleteProductPage.openDeletePopup();
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
      await basePage.getAllTextContents(deleteProductPage.alertDialog)
    ).toContain(deleteProductData.failedMessage);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
