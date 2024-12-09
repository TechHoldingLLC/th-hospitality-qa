import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminViewEventsPage } from "../pageObjects/adminViewEvents";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewEventsPage: adminViewEventsPage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1792, height: 1080 });
    basePage = new BasePage(page);
    loginPage = new adminLoginPage(page);
    viewEventsPage = new adminViewEventsPage(page);
    //Navigation to admin portal
    await basePage.navigateTo(config.adminPortalUrl);
    //Login
    await loginPage.login(config.email, config.password);
    //Navigation to evets Listing page
    await basePage.clickElement(viewEventsPage.eventsButton);
});

test.afterEach(async () => {
    await browser.close();
});

test("TC0075 - Verify that users can view a list of events", async () => {
    //Verify navigation to Events Listing page
    expect(await basePage.isElementVisible(viewEventsPage.eventCreateButton));

    //Verify that the event list displays expected columns
    expect(await basePage.isElementVisible(viewEventsPage.eventNameLabel));
    expect(await basePage.isElementVisible(viewEventsPage.programNameLabel));
    expect(await basePage.isElementVisible(viewEventsPage.eventDateLabel));
    expect(await basePage.isElementVisible(viewEventsPage.departmentLabel));
    expect(await basePage.isElementVisible(viewEventsPage.groupsLabel));
    expect(await basePage.isElementVisible(viewEventsPage.noOfPackagesLabel));
    expect(await basePage.isElementVisible(viewEventsPage.statusLabel));

    //Verify Event Name column data
    const eventNameElements = await viewEventsPage.eventNameColumnData.all();
    for (const element of eventNameElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }

    //Verify Program Name column data
    const programNameElements = await viewEventsPage.programNameColumnData.all();
    for (const element of programNameElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }

    //Verify Event Date column data
    const eventDateElements = await viewEventsPage.eventDateColumnData.all();
    for (const element of eventDateElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }

    //Verify Department column data
    const departmentElements = await viewEventsPage.departmentColumnData.all();
    for (const element of departmentElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }

    //Verify Groups column data
    const groupsElements = await viewEventsPage.groupsColumnData.all();
    for (const element of groupsElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }

    //Verify No of packages column data
    const noOfPackagesElements = await viewEventsPage.noOfPackagesColumnData.all();
    for (const element of noOfPackagesElements) {
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
    }

    //Verify Status column data
    const statusElements = await viewEventsPage.statusColumnData.all();
    for (const element of statusElements) {
        const textContent = await element.textContent();
        expect(textContent === 'DRAFT' || textContent === 'PUBLISHED').toBe(true);
    }
});

test("TC0077 - Verify the CTA’s to create, edit and delete a events", async () => {
    //Verify navigation to Create Event page
    await basePage.clickElement(viewEventsPage.eventCreateButton);
    expect(await basePage.isElementVisible(viewEventsPage.addEventHeader)).toBe(true);
    //Navigation to evets Listing page
    await basePage.clickElement(viewEventsPage.eventsButton);

    //Verify navigation to Edit Event page
    await basePage.clickElement(viewEventsPage.kebabMenu);
    await basePage.clickElement(viewEventsPage.editButton);
    expect(await basePage.isElementVisible(viewEventsPage.editEventHeader)).toBe(true);
    //Navigation to evets Listing page
    await basePage.clickElement(viewEventsPage.eventsButton);

    //Verify navigation to Delete Event page
    await basePage.clickElement(viewEventsPage.kebabMenu);
    await basePage.clickElement(viewEventsPage.deleteButton);
    expect(await basePage.isElementVisible(viewEventsPage.confirmDeleteButton)).toBe(true);
});