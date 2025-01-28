import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminCreateEditPackagePage } from "../pageObjects/adminCreateEditPackage";
import { config } from "../config/config.qa";
import { adminDeletePackagesPage } from "../pageObjects/adminDeletePackages";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createEditPackagePage: adminCreateEditPackagePage;
let deletePackagesPage: adminDeletePackagesPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  test.setTimeout(110000);
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  createEditPackagePage = new adminCreateEditPackagePage(page);
  deletePackagesPage = new adminDeletePackagesPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0089 - Verify that an admin can successfully delete a package that is not associated with any event or program.", async () => {
  try {
    // Create and validate package creation.
    const packageName = await basePage.generateNomenclatureName("Package");
    await createEditPackagePage.addPackage(packageName);
    expect(
      await basePage.isElementVisible(
        createEditPackagePage.packageCreationSuccessMessage
      )
    ).toBe(true);

    await deletePackagesPage.openDeletePopupByPackageName(packageName);
    expect(
      await basePage.isElementVisible(
        await deletePackagesPage.getDeleteConfirmationLocator(packageName)
      )
    ).toBe(true);

    // Delete the package and validate the success message.
    await basePage.clickElement(deletePackagesPage.deletePackageButton);
    expect(
      await basePage.isElementVisible(
        await deletePackagesPage.getDeleteSuccessLocator(packageName)
      )
    ).toBe(true);

    // Validate successful package deleted.
    await basePage.clickElement(deletePackagesPage.confirmationButton);
    await deletePackagesPage.page.reload();
    expect(
      (await (await deletePackagesPage.getPackageName(packageName)).all())
        .length
    ).toBe(0);
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
        await basePage.isElementVisible(deletePackagesPage.deleteMessageLabel)
      ).toBe(true);
      await basePage.clickElement(deletePackagesPage.cancelPackageButton);
      await basePage.waitForElementHidden(deletePackagesPage.alertDialog);
      expect(await deletePackagesPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deletePackagesPage.openDeletePopupRandomly();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deletePackagesPage.openDeletePopupRandomly();
    await verifyAlertDialogVisibleAndHidden();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0091 - Verify that if the package is associated with orders an error message appears", async () => {
  try {
    const packageName = await deletePackagesPage.getPackageNameFromOrderPage();
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
      await basePage.isElementVisible(
        await deletePackagesPage.getErrorMessageLocator()
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
