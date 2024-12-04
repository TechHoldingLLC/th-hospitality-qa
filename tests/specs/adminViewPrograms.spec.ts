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
});

test.afterEach(async () => {
    await browser.close();
});

test("Verify navigation to View Programs page", async () => {
    try {
        await basePage.navigateTo(config.adminPortalUrl);
        await page.waitForTimeout(3000);
        //Login
        await loginPage.login(config.email, config.password);
        await page.waitForTimeout(3000);
        //Navigation to Programs Listing page
        await basePage.clickElement(viewProgramsPage.programsButton);
        await basePage.waitForElementVisible(viewProgramsPage.addProgramButton);
        //Verify navigation to Program listing page
        expect(await basePage.isElementVisible(viewProgramsPage.addProgramButton)).toBe(true);
        await page.waitForTimeout(3000);
    } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
    }
});
//Verify the program list displays the expected columns
test("Verify UI components on Programs Listing page", async () => {
    await basePage.navigateTo(config.adminPortalUrl);
    await page.waitForTimeout(3000);
    //Login
    await loginPage.login(config.email, config.password);
    await page.waitForTimeout(3000);
    //Navigation to Programs Listing page
    await basePage.clickElement(viewProgramsPage.programsButton);
    await basePage.waitForElementVisible(viewProgramsPage.addProgramButton);
    expect(await basePage.isElementVisible(viewProgramsPage.addProgramButton)).toBe(true);

    //Verifying all columns are visible on page
    await expect(viewProgramsPage.programNameHeader).toBeVisible();
    await expect(viewProgramsPage.departmentHeader).toBeVisible();
    await expect(viewProgramsPage.groupsHeader).toBeVisible();
    await expect(viewProgramsPage.eventDateRangeHeader).toBeVisible();
    await expect(viewProgramsPage.noOfEventsHeader).toBeVisible();
    await expect(viewProgramsPage.noOfPackagesHeader).toBeVisible();
    await expect(viewProgramsPage.noOfOrdersHeader).toBeVisible();

    //Verifying groups column content text
    const groupElements = await viewProgramsPage.groupsColumnData.all();
    for (const element of groupElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }
    //Verifying department column content text
    const departmentElements = await viewProgramsPage.departmentColumnData.all();
    for (const element of departmentElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }
    //Verifying event date/range column content text
    const eventDateRangeElements = await viewProgramsPage.eventDateRangeColumnData.all();
    for (const element of eventDateRangeElements) {
        const textContent: string | null = await element.textContent();
        expect(textContent).not.toBeNull();
    }
    //Verifying department column content text
    const noOfEventsElements = await viewProgramsPage.noOfEventsColumnData.all();
    for (const element of noOfEventsElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }
    //Verifying event date/range column content text
    const noOfPackagesElemets = await viewProgramsPage.noOfPackagesColumnData.all();
    for (const element of noOfPackagesElemets) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }
});
//Verify the presence and functionality of the EDIT action buttons
test("Verify Call-To-Actions - EDIT program", async () => {
    await basePage.navigateTo(config.adminPortalUrl);
    await page.waitForTimeout(3000);
    //Login
    await loginPage.login(config.email, config.password);
    await page.waitForTimeout(3000);
    //Navigation to Programs Listing page
    await basePage.clickElement(viewProgramsPage.programsButton);
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.editButton);
    //Verify edit action
    await expect(viewProgramsPage.editProgramHeader).toBeVisible();
});
//Verify the presence and functionality of the DELETE action buttons
test("Verify Call-To-Actions - DELETE program", async () => {
    await basePage.navigateTo(config.adminPortalUrl);
    await page.waitForTimeout(3000);
    //Login
    await loginPage.login(config.email, config.password);
    await page.waitForTimeout(3000);
    //Navigation to Programs Listing page
    await basePage.clickElement(viewProgramsPage.programsButton);
    await basePage.clickElement(viewProgramsPage.kebabMenuIcon);
    await basePage.clickElement(viewProgramsPage.deleteButton);
    await basePage.clickElement(viewProgramsPage.confirmDeleteButton);
    //Verify delete action
    await expect(viewProgramsPage.deleteProgramConfirmation).toBeVisible();
});
//Verify the presence and functionality of the CREATE action buttons
test("Verify Call-To-Actions - CREATE program", async () => {
    await basePage.navigateTo(config.adminPortalUrl);
    await page.waitForTimeout(3000);
    //Login
    await loginPage.login(config.email, config.password);
    await page.waitForTimeout(3000);
    //Navigation to Programs Listing page
    await basePage.clickElement(viewProgramsPage.programsButton);
    await basePage.clickElement(viewProgramsPage.addProgramButton);
    //Verify add action
    await expect(viewProgramsPage.addProgramHeader).toBeVisible();
});