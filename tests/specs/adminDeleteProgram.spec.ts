import { test, Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProgramPage } from "../pageObjects/adminCreateEditProgram";
import { adminDeleteProgramPage } from "../pageObjects/adminDeleteProgram";
import deleteProgramData from "../data/deleteProgramData.json";

let browser: Browser;
let page: Page;
let viewProgramsPage: adminViewProgramsPage;
let loginPage: adminLoginPage;
let basePage: BasePage;
let createEditProgram: adminCreateEditProgramPage;
let deleteProgramPage: adminDeleteProgramPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  viewProgramsPage = new adminViewProgramsPage(page);
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  createEditProgram = new adminCreateEditProgramPage(page);
  deleteProgramPage = new adminDeleteProgramPage(page);

  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewProgramsPage.programsButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0086 - Verify that an admin can successfully delete a program that is not associated with events, packages, or products.", async () => {
  const programName = await basePage.generateNomenclatureName(
    deleteProgramData.programNamePrefix
  );
  const expectedDeleteConfirmationMessage = `${deleteProgramData.expectedDeleteConfirmationMessage} "${programName}" ${deleteProgramData.deleteConfirmationSuffix}`;
  const expectedDeleteSuccessMessage = `${programName} ${deleteProgramData.expectedDeleteSuccessMessage}`;

  try {
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    await createEditProgram.createProgram(programName);

    // Validate created program.
    await basePage.waitForPageToBeReady();
    await basePage.enterValuesInElement(
      deleteProgramPage.searchInput,
      programName
    );
    await basePage.waitForElementVisible(deleteProgramPage.paginationStatus);
    expect(
      await basePage.getElementText(deleteProgramPage.programInputText.first())
    ).toEqual(programName);

    // Validate delete confirmation.
    await deleteProgramPage.openDeletePopup();
    await basePage.waitForPageToBeReady();
    expect(
      await basePage.getElementText(deleteProgramPage.deleteMessageLabel)
    ).toEqual(expectedDeleteConfirmationMessage);

    // Validate delete success.
    await basePage.clickElement(deleteProgramPage.deleteProgramButton);
    await basePage.waitForElementVisible(
      deleteProgramPage.programDeleteSuccessLabel
    );
    expect(
      await basePage.getElementText(deleteProgramPage.deleteMessageLabel)
    ).toEqual(expectedDeleteSuccessMessage);

    // Validate program delete successfully.
    await basePage.clickElement(deleteProgramPage.confirmationButton);
    expect(
      await basePage.getElementText(deleteProgramPage.noResultsMessageContainer)
    ).toContain(deleteProgramData.expectedErrorMessages);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0087 - Verify that if the program is not associated with packages, products, and orders, a confirmation prompt appears", async () => {
  try {
    const verifyAlertDialogVisibleAndHidden = async () => {
      expect(
        await basePage.isElementVisible(deleteProgramPage.alertDialog)
      ).toBe(true);
      expect(
        await basePage.getElementText(deleteProgramPage.deleteMessageLabel)
      ).toContain(deleteProgramData.expectedDeleteConfirmationMessage);
      await basePage.clickElement(deleteProgramPage.cancelProgramButton);
      await deleteProgramPage.alertDialog.waitFor({ state: "hidden" });
      expect(await deleteProgramPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deleteProgramPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deleteProgramPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0088 - verify that if the programs is associated with packages, products and orders an error message appears.", async () => {
  try {
    await deleteProgramPage.deleteReferredProgram();

    expect(
      await basePage.isElementVisible(
        deleteProgramPage.failedToDeleteProgramLabel
      )
    ).toBe(true);

    expect(
      await basePage.getElementText(deleteProgramPage.alertDialog)
    ).not.toBeNull();

    expect(
      await basePage.getAllTextContents(deleteProgramPage.alertDialog)
    ).toContain(deleteProgramData.failedMessage);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
