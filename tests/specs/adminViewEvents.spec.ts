import { test, Browser, Page, chromium, expect } from "@playwright/test";
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
  try {
    //Verify navigation to Events Listing page
    expect(
      await basePage.isElementVisible(viewEventsPage.eventCreateButton)
    ).toBe(true);

    //Verify that the event list displays expected columns
    expect(await basePage.isElementVisible(viewEventsPage.eventNameLabel)).toBe(
      true
    );
    expect(
      await basePage.isElementVisible(viewEventsPage.programNameLabel)
    ).toBe(true);
    expect(await basePage.isElementVisible(viewEventsPage.eventDateLabel)).toBe(
      true
    );
    expect(
      await basePage.isElementVisible(viewEventsPage.departmentLabel)
    ).toBe(true);
    expect(await basePage.isElementVisible(viewEventsPage.groupsLabel)).toBe(
      true
    );
    expect(
      await basePage.isElementVisible(viewEventsPage.noOfPackagesLabel)
    ).toBe(true);
    expect(await basePage.isElementVisible(viewEventsPage.statusLabel)).toBe(
      true
    );

    //Verify Event Name column data
    await basePage.validateColumnData(viewEventsPage.eventNameColumnData);

    //Verify Program Name column data
    await basePage.validateColumnData(viewEventsPage.programNameColumnData);

    //Verify Event Date column data
    await basePage.validateColumnData(viewEventsPage.eventDateColumnData);

    //Verify Department column data
    await basePage.validateColumnData(viewEventsPage.departmentColumnData);

    //Verify Groups column data
    await basePage.validateColumnData(viewEventsPage.groupsColumnData);

    //Verify No of packages column data
    await basePage.validateColumnData(viewEventsPage.noOfPackagesColumnData);

    //Verify Status column data
    const statusElements = await viewEventsPage.statusColumnData.all();
    for (const element of statusElements) {
      const textContent = await element.textContent();
      expect(textContent === "DRAFT" || textContent === "PUBLISHED").toBe(true);
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
    expect(await basePage.isElementVisible(viewEventsPage.addEventHeader)).toBe(
      true
    );
    //Navigation to evets Listing page
    await basePage.clickElement(viewEventsPage.eventsButton);

    //Verify navigation to Edit Event page
    await basePage.clickElement(viewEventsPage.kebabMenu);
    await basePage.clickElement(viewEventsPage.editButton);
    expect(
      await basePage.isElementVisible(viewEventsPage.editEventHeader)
    ).toBe(true);
    //Navigation to evets Listing page
    await basePage.clickElement(viewEventsPage.eventsButton);

    //Verify navigation to Delete Event page
    await basePage.clickElement(viewEventsPage.kebabMenu);
    await basePage.clickElement(viewEventsPage.deleteButton);
    expect(
      await basePage.isElementVisible(viewEventsPage.confirmDeleteButton)
    ).toBe(true);
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
    expect(
      await basePage.isElementVisible(viewEventsPage.paginationFooter)
    ).toBe(true);

    let listItems = await viewEventsPage.eventList.all();
    expect(listItems.length).toBeLessThanOrEqual(eventsPerPage);
    // Verify Prev button on initial page
    expect(await basePage.isElementDisabled(viewEventsPage.prevButton)).toBe(
      true
    );

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
    expect(await basePage.isElementDisabled(viewEventsPage.nextButton)).toBe(
      true
    );

    // Verify Prev button behavior by navigating back one page
    await basePage.clickElement(viewEventsPage.prevButton);
    // Verify Next button is re-enabled
    expect(await basePage.isElementEnabled(viewEventsPage.nextButton)).toBe(
      true
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0076 - Verify that users can filter by events", async () => {
  try {
    // click on Add filter button
    await basePage.clickElement(viewEventsPage.addFilterButton);

    // click on Status menu item
    await basePage.clickElement(viewEventsPage.statusMenuItem);

    // select random status from list
    const selectedStatus: null | string =
      await basePage.selectRandomItemFromMultiSelectList(
        viewEventsPage.statusListFromMenuItem
      );

    if (selectedStatus === null) {
      expect(
        selectedStatus,
        "Null value found while retrieving the text of the selected status."
      ).not.toBeNull();
    } else {
      // Get Status column data locators
      const satusColumnLocator = await basePage.getColumnDataLocators("Status");

      expect(satusColumnLocator.length).toBeGreaterThan(0);

      // Iterate through rowData to validate each cell's content
      for (const rowLocator of satusColumnLocator) {
        const cellText = await basePage.getElementTextContent(rowLocator);

        // Validate each row's textContent
        expect(cellText).toEqual(selectedStatus.toString());
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0187 - Verify Filter functionality for Event name by sorting order", async () => {
  try {
    // click on filter menu button
    await basePage.clickElement(viewEventsPage.filterMenuButton);

    // click on Event Name menu item
    await basePage.clickElement(viewEventsPage.eventNameMenuItem);

    // Click on Ascending button and verify data
    const [actualDataAsc, sortedDataAsc] =
      await basePage.performAndGetSortingData(
        "Ascending",
        viewEventsPage.eventNameColumnData,
        "Event Name"
      );

    expect(actualDataAsc).toEqual(sortedDataAsc);

    // Click on Descending button and verify data
    const [actualDataDes, sortedDataDes] =
      await basePage.performAndGetSortingData(
        "Descending",
        viewEventsPage.eventNameColumnData,
        "Event Name"
      );

    expect(actualDataDes).toEqual(sortedDataDes);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
