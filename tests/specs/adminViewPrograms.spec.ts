import { Browser, Page, chromium, expect, test } from "@playwright/test";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";

let browser: Browser;
let page: Page;
let viewProgramsPage: adminViewProgramsPage;
let loginPage: adminLoginPage;
let basePage: BasePage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1792, height: 1080 });
  viewProgramsPage = new adminViewProgramsPage(page);
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
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

test("TC0037 - Verify the program list displays the expected data", async () => {
  try {
    await basePage.waitForElementVisible(viewProgramsPage.addProgramButton);
    expect(
      await basePage.isElementVisible(viewProgramsPage.addProgramButton)
    ).toBe(true);

    //Verifying all columns are visible on page
    await expect(viewProgramsPage.programNameHeader).toBeVisible();
    await expect(viewProgramsPage.departmentHeader).toBeVisible();
    await expect(viewProgramsPage.groupsHeader).toBeVisible();
    await expect(viewProgramsPage.eventDateRangeHeader).toBeVisible();
    await expect(viewProgramsPage.noOfEventsHeader).toBeVisible();
    await expect(viewProgramsPage.noOfPackagesHeader).toBeVisible();
    await expect(viewProgramsPage.noOfOrdersHeader).toBeVisible();

    //Verifying groups column content text
    await basePage.validateColumnData(viewProgramsPage.groupsColumnData);

    //Verifying department column content text
    await basePage.validateColumnData(viewProgramsPage.departmentColumnData);

    //Verifying event date/range column content text
    const eventDateRangeElements =
      await viewProgramsPage.eventDateRangeColumnData.all();
    for (const element of eventDateRangeElements) {
      const textContent: string | null = await element.textContent();
      expect(textContent).not.toBeNull();
    }

    //Verifying department column content text
    await basePage.validateColumnData(viewProgramsPage.noOfEventsColumnData);

    //Verifying event # of Packages column content text
    await basePage.validateColumnData(viewProgramsPage.noOfPackagesColumnData);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
//Verify the presence and functionality of the EDIT action buttons
test("TC0095 - Verify the CTA to edit a program", async () => {
  try {
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.editButton);
    //Verify edit action
    await expect(viewProgramsPage.editProgramHeader).toBeVisible();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
//Verify the presence and functionality of the DELETE action buttons
test("TC0096 - Verify the CTA delete a program", async () => {
  try {
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.deleteButton);
    await basePage.clickElement(viewProgramsPage.confirmDeleteButton);
    //Verify delete action
    await expect(viewProgramsPage.deleteProgramConfirmation).toBeVisible();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
//Verify the presence and functionality of the CREATE action buttons
test("TC0039 - Verify the CTA to create a program", async () => {
  try {
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    //Verify add action
    await expect(viewProgramsPage.addProgramHeader).toBeVisible();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
