import { test, Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminViewEventsPage } from "../pageObjects/adminViewEvents";
import exp from "constants";

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
    try {
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
    } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
    }
});

test("TC0077 - Verify the CTA’s to create, edit and delete a events", async () => {
    try {
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
    } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
    }
});

test("TC0107 - Verify the list of events is paginated", async () => {
    try {
        const eventsPerPage = 10;

        // Verify pagination footer and initial page setup
        await basePage.waitForElementVisible(viewEventsPage.paginationFooter);
        expect(await basePage.isElementVisible(viewEventsPage.paginationFooter)).toBe(true);

        let listItems = await viewEventsPage.eventList.all();
        expect(listItems.length).toBeLessThanOrEqual(eventsPerPage);
        // Verify Prev button on initial page
        expect(await basePage.isElementDisabled(viewEventsPage.prevButton)).toBe(true);

        // Iterate through pages using the Next button
        while (await basePage.isElementEnabled(viewEventsPage.nextButton)) {
            // Assert item count for intermediate pages
            expect(listItems.length).toBe(eventsPerPage);
            await basePage.clickElement(viewEventsPage.nextButton);
            // Fetch updated list items
            listItems = await viewEventsPage.eventList.all();
        }

        // Verify last page item count and Next button behavior
        expect(listItems.length).toBeLessThanOrEqual(eventsPerPage);
        // Verify Next button on last page
        expect(await basePage.isElementDisabled(viewEventsPage.nextButton)).toBe(true);

        // Verify Prev button behavior by navigating back one page
        await basePage.clickElement(viewEventsPage.prevButton);
        // Verify Next button is re-enabled
        expect(await basePage.isElementEnabled(viewEventsPage.nextButton)).toBe(true);

    } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
    }
});