import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminViewOrderListPage } from "../pageObjects/adminViewOrderList";
import { config } from "../config/config.qa";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewOrderListPage: adminViewOrderListPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  viewOrderListPage = new adminViewOrderListPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewOrderListPage.ordersButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0215 - Verify that admins can access the orders list from the main navigation.", async () => {
  try {
    // Verify expected columns are displayed
    expect(
      await basePage.isElementVisible(viewOrderListPage.orderIdHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.orderIdHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.orderDateHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.orderStatusHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.coordinatorHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.programNameHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.noOfPackagesHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.guestsHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.orderTotalHeader)
    ).toBe(true);
    expect(
      await basePage.isElementVisible(viewOrderListPage.approvingManagerHeader)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0216 - Verify that that all columns are displayed with the appropriate data.", async () => {
  try {
    // Verify Order Id column data
    await basePage.validateColumnData(viewOrderListPage.orderIdColumnDataList);

    // Verify Order Date column data
    await basePage.validateColumnData(
      viewOrderListPage.orderDateColumnDataList
    );
    const orderDateResults =
      await viewOrderListPage.validateOrderDateColumnWithSpecificFormat();
    // Perform assertions
    for (const isValidFormat of orderDateResults) {
      expect(isValidFormat).toBe(true); // Ensure all dates match the MM-DD-YY format
    }

    // Verify Order Status column data
    await basePage.validateColumnData(
      viewOrderListPage.orderStatusColumnDataList
    );
    const statusElements =
      await viewOrderListPage.orderStatusColumnDataList.all();
    for (const element of statusElements) {
      const textContent = await element.textContent();
      expect(
        textContent === "Pending" ||
          textContent === "Approved" ||
          textContent === "Denied" ||
          textContent === "Cancelled"
      ).toBe(true);
    }

    // Verify Coordinator column data
    await basePage.validateColumnData(
      viewOrderListPage.coordinatorColumnDataList
    );

    // Verify Program Name column data
    await basePage.validateColumnData(
      viewOrderListPage.programNameColumnDataList
    );

    // Verify No of Packages column data
    await basePage.validateColumnData(
      viewOrderListPage.noOfPackagesColumnDataList
    );
    const noOfPackagesDataResults =
      await viewOrderListPage.validateNoOfPackagesColumnData();
    // Perform assertions
    for (const isValidFormat of noOfPackagesDataResults) {
      expect(isValidFormat).toBe(true); // Ensure all values are digits
    }

    // Verify Order Id column data
    await basePage.validateColumnData(viewOrderListPage.orderIdColumnDataList);

    // Verify Guests column data
    await basePage.validateColumnData(viewOrderListPage.guestsColumnDataList);

    // Verify Order Total column data
    await basePage.validateColumnData(
      viewOrderListPage.orderTotalColumnDataList
    );

    // Verify Approving Manager column data
    await basePage.validateColumnData(
      viewOrderListPage.approvingManagerColumnDataList
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0218 - Verify that clicking on an order row navigates to the order detail view.", async () => {
  try {
    await basePage.selectRandomItemFromMultiSelectList(
      viewOrderListPage.orderIdColumnDataList
    );
    expect(
      await basePage.isElementVisible(viewOrderListPage.orderDetailsSection)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0219 - Verify that an admin can approve an order.", async () => {
  try {
    // Pick the Order with Pending status
    const orderId = await viewOrderListPage.openActionSheetForGivenStatus(
      "Pending"
    );
    // Verify action sheet has Approve Order CTA
    expect(
      await basePage.isElementVisible(viewOrderListPage.approveOrderButton)
    );

    // Approve selected order and verify updated status after approval
    await basePage.clickElement(viewOrderListPage.approveOrderButton);
    expect(
      await basePage.isElementVisible(
        viewOrderListPage.orderAppoveSuccessMessage
      )
    ).toBe(true);
    await basePage.waitForElementHidden(
      viewOrderListPage.orderAppoveSuccessMessage
    );
    await basePage.waitForPageToBeReady();
    expect(await viewOrderListPage.getOrderStatusById(orderId)).toEqual(
      "Approved"
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
