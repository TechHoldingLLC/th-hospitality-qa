import { test, Browser, Page, chromium, expect } from "@playwright/test";
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
  try {
    await basePage.clickElement(viewProgramsPage.addProgramButton);

    //Verify expected components are visible on screen
    expect(
      await basePage.isElementVisible(createEditProgram.programNameLabel)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(createEditProgram.departmentsLabel)
    ).toBe(true);
    expect(await basePage.isElementVisible(createEditProgram.groupsLabel)).toBe(
      true
    );

    //Generate Nomenclature name for program
    const programInputText = await basePage.generateNomenclatureName("Program");

    //Fill up add program form and create a program
    await createEditProgram.createProgram(programInputText);

    //Verify program created successfully
    expect(
      await basePage.isElementVisible(createEditProgram.createSuccessMessage)
    ).toBe(true);
    //Verify created program gets populated on program listing page
    const createdProgramLocator = page
      .locator(`text=${programInputText}`)
      .first();
    expect(await basePage.getElementText(createdProgramLocator)).toEqual(
      programInputText
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0040 - Verify that the application validates program name is unique in the system", async () => {
  try {
    const existingProgramName = await basePage.getElementText(
      createEditProgram.firstProgramName
    );
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    //Try to create program using already existing program name
    await basePage.enterValuesInElement(
      createEditProgram.programNameInput,
      existingProgramName
    );
    await basePage.enterValuesInElement(
      createEditProgram.slugInput,
      await basePage.generateRandomString()
    );
    await basePage.clickElement(createEditProgram.saveButton);
    //Verify validation message for non unique program name
    expect(
      await basePage.isElementVisible(
        createEditProgram.uniqueProgramNameErrorMessage
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0043 - Verify that users can successfully create and edit programs.", async () => {
  try {
    await basePage.clickElement(viewProgramsPage.addProgramButton);

    //Generate Nomenclature name for program
    const programInputText = await basePage.generateNomenclatureName("Program");

    //Fill up add program form and create program
    await createEditProgram.createProgram(programInputText);

    //Verify program created successfully
    expect(
      await basePage.isElementVisible(createEditProgram.createSuccessMessage)
    ).toBe(true);

    //Edit an existing program
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.editButton);
    const editedName = programInputText + "-Edited";
    await basePage.enterValuesInElement(
      createEditProgram.programNameInput,
      editedName
    );
    await basePage.clickElement(createEditProgram.saveButton);
    expect(
      await basePage.isElementVisible(
        createEditProgram.editProgramSuccessMessage
      )
    ).toBe(true);

    //Verify changes made to the program are reflected and saved successfully
    expect(
      await basePage.getElementText(createEditProgram.nameOnDetailsPage)
    ).toEqual(editedName);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0041 - Verify that edited programs appear updated in the products list", async () => {
  try {
    //Edit an existing program
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.editButton);
    // const existingName = await createEditProgram.programNameInput.getAttribute('value');

    //Generate Nomenclature edited name for program
    const editedName = await basePage.generateNomenclatureName("Program");

    await basePage.enterValuesInElement(
      createEditProgram.programNameInput,
      editedName
    );
    await basePage.clickElement(createEditProgram.saveButton);
    await basePage.clickElement(viewProgramsPage.programsButton.first());
    await basePage.waitForPageToBeReady();
    const editedProgramLocator = page.locator(`text=${editedName}`).first();
    expect(await basePage.getElementText(editedProgramLocator)).toEqual(
      editedName
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0042 - Verify required and optional fields while creation of new Program from the list.", async () => {
  try {
    //Test on Add Program page
    //Verify Save button is disabled when mandatory fields are empty
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    expect(await basePage.isElementDisabled(createEditProgram.saveButton)).toBe(
      true
    );

    //Generate Nomenclature name for program
    const programInputText = await basePage.generateNomenclatureName("Program");
    //Verify Save button is enabled when mandatory fields are filled
    await basePage.enterValuesInElement(
      createEditProgram.programNameInput,
      programInputText
    );
    await basePage.enterValuesInElement(
      createEditProgram.slugInput,
      await basePage.generateRandomString()
    );
    expect(await basePage.isElementEnabled(createEditProgram.saveButton)).toBe(
      true
    );
    await basePage.clickElement(createEditProgram.closeIconOnAddProgram);
    await basePage.clickElement(createEditProgram.confirmCloseAddProgram);

    //Test on Edit Program page
    //Verify Save button is disabled when mandatory fields are empty
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.editButton);
    await createEditProgram.programNameInput.clear();
    expect(await basePage.isElementDisabled(createEditProgram.saveButton)).toBe(
      true
    );
    //Verify Save button is enabled when mandatory fields are filled
    await basePage.enterValuesInElement(
      createEditProgram.programNameInput,
      programInputText
    );
    expect(await basePage.isElementEnabled(createEditProgram.saveButton)).toBe(
      true
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
