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
let deleteProgramPage :adminDeleteProgramPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
//  await page.setViewportSize({ width: 1780, height: 720 });
  viewProgramsPage = new adminViewProgramsPage(page);
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  createEditProgram = new adminCreateEditProgramPage(page);
  deleteProgramPage = new adminDeleteProgramPage(page);
   
  //Navigation to admin portal
  await basePage.navigateTo(config.adminPortalUrl);
  //Login
  await loginPage.login(config.email, config.password);
  //Navigation to Programs Listing page
  await basePage.clickElement(viewProgramsPage.programsButton);
});

test.afterEach(async () => {
  await browser.close();
});

test.only("TC0086 - verify that the user can access a CTA to delete", async () => {
  try {
    // Click on Add Program button
    await basePage.clickElement(viewProgramsPage.addProgramButton);

    //Generate Nomenclature name for program
    const programInputText = await basePage.generateNomenclatureName("Program");

    //Fill up add program form and create a program
    await createEditProgram.createProgram(programInputText);

    //Verify program created successfully
    expect(await basePage.isElementVisible(createEditProgram.createSuccessMessage)).toBe(true);

    //Verify created program gets populated on program listing page
    const createdProgramLocator = page.locator(`text=${programInputText}`).first();
    expect(await basePage.getElementText(createdProgramLocator)).toEqual(programInputText);

    // Delete Program
    await deleteProgramPage.deleteProgram(programInputText);

    // Verify Program successfully deleted or not
    await deleteProgramPage.searchDeletedProgram(programInputText);

  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
