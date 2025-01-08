import { test, Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProgramPage } from "../pageObjects/adminCreateEditProgram";
import { adminDeleteProgramPage } from "../pageObjects/adminDeleteProgram";

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
  //  await page.setViewportSize({ width: 1780, height: 720 });
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

test("TC0086 - verify that the user can access a CTA to delete", async () => {
  const expectedMessages = [
    "No results",
    "Try changing the filters or search query",
  ];
  const programName = await basePage.generateNomenclatureName("Program");
  const expectedDeleteConfirmationMessage: string = `This will permanently delete the program "${programName}" and cannot be undone.`;
  const expectedDeleteSuccessMessage: string = `${programName} was successfully deleted.`;

  try {
    // Create program and validate
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    await createEditProgram.createProgram(programName);
    await createEditProgram.waitForConformationToAppearAndHidden();

    await deleteProgramPage.searchProgramByName(programName);
    const isVisible: boolean =
      await deleteProgramPage.validateProgramInputTextVisibility();
    expect(isVisible).toBe(true);

    await deleteProgramPage.openDeletePopup();
    expect(await deleteProgramPage.getDeleteConfirmationMessage()).toBe(
      expectedDeleteConfirmationMessage
    );

    // Delete program and validate success message
    await deleteProgramPage.deleteProgram();
    await deleteProgramPage.page.waitForTimeout(2000);
    expect(await deleteProgramPage.getDeleteSuccessMessage()).toBe(
      expectedDeleteSuccessMessage
    );

    // Conform delectation and validate
    await deleteProgramPage.clickConformDelete();
    await deleteProgramPage.searchProgramByName(programName);

    const actualErrorMessage = await deleteProgramPage.getNoResultsMessage();
    expectedMessages.forEach((expectedMessage) => {
      expect(actualErrorMessage).toContain(expectedMessage);
    });
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0087 - Verify that if the program is not associated with packages, products, and orders, a confirmation prompt appears", async () => {
  try {
    // Verify using both cancel options
    await deleteProgramPage.cancelDeleteProgramWithValidation("button");
    await deleteProgramPage.cancelDeleteProgramWithValidation("logo");
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0088 - verify that if the programs is associated with packages, products and orders an error message appears.", async () => {
  const failedMessage: string = "Failed to delete program";
  const referenceMessage: string =
    "This program can't be deleted because it is referenced by one or more products, packages or events.";

  try {
    await deleteProgramPage.getReferredProgramRow();
    await deleteProgramPage.clickMenuButtonForNumericRow();
    await deleteProgramPage.deleteSelectedProgramFromMenu();

    const alertMessage = await deleteProgramPage.getAlertMessage();
    expect(alertMessage).not.toBeNull();
    expect(alertMessage).toContain(failedMessage);
    expect(alertMessage).toContain(referenceMessage);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
