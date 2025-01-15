import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminCreateEditPackagePage } from "../pageObjects/adminCreateEditPackage";
import { config } from "../config/config.qa";
import { adminDeletePackagesPage } from "../pageObjects/adminDeletePackages";
import { adminViewPackagesPage } from "../pageObjects/adminViewPackages";
import deletePackageData from "../data/deletePackagesData.json";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditPackagePage: adminCreateEditPackagePage;
let viewPackagesPage: adminViewPackagesPage;
let deletePackagesPage: adminDeletePackagesPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  createEditPackagePage = new adminCreateEditPackagePage(page);
  viewPackagesPage = new adminViewPackagesPage(page);
  deletePackagesPage = new adminDeletePackagesPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0089 - Verify that an admin can successfully delete a package that is not associated with any event or program.", async () => {
  try {
    // create and validate package.
    const packageName = await basePage.generateNomenclatureName("Package");
    await createEditPackagePage.addPackage(packageName);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageCreationSuccessMessage
      )
    ).toBe(true);
    await basePage.waitForElementVisible(
      await deletePackagesPage.menuButtonByPackageName(packageName)
    );
    expect(
      await basePage.getElementText(deletePackagesPage.packageInputText.first())
    ).toEqual(packageName);

    // Validate delete confirmation message.
    await deletePackagesPage.openDeletePopup(packageName);
    expect(
      await basePage.getElementText(deletePackagesPage.deleteMessageLabel)
    ).toEqual(
      `${deletePackageData.expectedDeleteConfirmationMessage} "${packageName}" ${deletePackageData.deleteConfirmationSuffix}`
    );

    // Delete and validate success message.
    await basePage.clickElement(deletePackagesPage.deletePackageButton);
    await basePage.waitForElementVisible(
      deletePackagesPage.packageDeleteSuccessLabel
    );
    expect(
      await basePage.getElementText(
        deletePackagesPage.deleteMessageLabel.last()
      )
    ).toEqual(
      `${packageName} ${deletePackageData.expectedDeleteSuccessMessage}`
    );

    // Validate package delete successfully.
    await basePage.clickElement(deletePackagesPage.confirmationButton);
    await basePage.waitForElementHidden(
      await deletePackagesPage.menuButtonByPackageName(packageName)
    );
    expect(
      await basePage.getElementText(deletePackagesPage.packageInputText.first())
    ).not.toEqual(packageName);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0090 - Verify that if the package is not associated with orders a confirmation prompt appears", async () => {
  try {
    await basePage.clickElement(createEditPackagePage.packagesButton);
    const verifyAlertDialogVisibleAndHidden = async () => {
      expect(
        await basePage.isElementVisible(deletePackagesPage.alertDialog)
      ).toBe(true);
      expect(
        await basePage.getElementText(deletePackagesPage.deleteMessageLabel)
      ).toContain(deletePackageData.expectedDeleteConfirmationMessage);
      await basePage.clickElement(deletePackagesPage.cancelPackageButton);
      await basePage.waitForElementHidden(deletePackagesPage.alertDialog);
      expect(await deletePackagesPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deletePackagesPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deletePackagesPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0091 - Verify that if the package is associated with orders an error message appears", async () => {
  try {
    const packageName = await deletePackagesPage.getPackageNameFromOrderPage();
    await basePage.clickElement(viewPackagesPage.packagesButton);
    await deletePackagesPage.attemptToDeletePackage(packageName!);

    expect(
      await basePage.isElementVisible(
        deletePackagesPage.failedToDeletePackageLabel
      )
    ).toBe(true);

    expect(
      await basePage.getElementText(deletePackagesPage.alertDialog)
    ).not.toBeNull();

    expect(
      await basePage.getAllTextContents(deletePackagesPage.alertDialog)
    ).toContain(deletePackageData.failedMessage);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
