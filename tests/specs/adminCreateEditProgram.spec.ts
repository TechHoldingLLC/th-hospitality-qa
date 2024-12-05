import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProgramPage } from "../pageObjects/adminCreateEditProgram";

let browser: Browser;
let page: Page;
let viewProgramsPage: adminViewProgramsPage;
let loginPage: adminLoginPage;
let basePage: BasePage;
let createEditProgram: adminCreateEditProgramPage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1780, height: 720 });
    viewProgramsPage = new adminViewProgramsPage(page);
    loginPage = new adminLoginPage(page);
    basePage = new BasePage(page);
    createEditProgram = new adminCreateEditProgramPage(page);
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

test("TC0097 - Verify that the user is able to create a program", async () => {
    const randomDig = await basePage.generateRandomDigits();
    const programInputText = `Coachella QA ${randomDig}`;
    await basePage.clickElement(viewProgramsPage.addProgramButton);

    //Verify expected components are visible on screen
    expect(await basePage.isElementVisible(createEditProgram.programNameLabel)).toBe(true);
    expect(await basePage.isElementVisible(createEditProgram.departmentLabel)).toBe(true);
    expect(await basePage.isElementVisible(createEditProgram.groupsLabel)).toBe(true);

    //Fill up add program form
    await basePage.enterValuesInElement(createEditProgram.programNameInput, programInputText);
    await createEditProgram.departmentDropdown.selectOption({ value: 'Global' });
    await basePage.clickElement(createEditProgram.groupsDropdown);
    await basePage.clickElement(createEditProgram.groupNameFranceOlympics);
    await basePage.clickElement(createEditProgram.groupNameMusic);
    await basePage.clickElement(createEditProgram.saveButton);

    //Verify program created successfully
    expect(await basePage.isElementVisible(createEditProgram.successMessage)).toBe(true);
    expect(await createEditProgram.firstProgramName.textContent()).toEqual(programInputText);
});

test("TC0040 - Verify that the application validates program name is unique in the system", async () => {
    const existingProgramName = await basePage.getElementText(createEditProgram.firstProgramName);
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    //Try to create program using already existing program name
    await basePage.enterValuesInElement(createEditProgram.programNameInput, existingProgramName);
    await basePage.clickElement(createEditProgram.saveButton);
    //Verify validation message for non unique program name
    expect(await basePage.isElementVisible(createEditProgram.uniqueProgramNameErrorMessage)).toBe(true);
});