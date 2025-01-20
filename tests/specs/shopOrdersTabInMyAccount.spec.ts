import test, { Browser, Page, chromium, expect } from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { shopOrdersTabInMyAccountPage } from "../pageObjects/shopOrdersTabInMyAccount";
import ordersTabInMyAccountData from "../data/ordersTabInMyAccountData.json";
import { text } from "node:stream/consumers";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let ordersTab: shopOrdersTabInMyAccountPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  loginPage = new adminLoginPage(page);
  ordersTab = new shopOrdersTabInMyAccountPage(page);

  //Navigation to admin portal
  await ordersTab.navigateTo(config.soapPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0140 - Verify order details are visible in collapsed view.", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderCount: number = (await ordersTab.orderListLocator.all()).length;

    if (orderCount > 0) {
      const randomOrder = Math.floor(Math.random() * (orderCount - 0) + 0);

      // Verify data is displayed
      ordersTabInMyAccountData.dataFieldsInOrder.forEach(async (field) => {
        expect(
          await page
            .locator(
              await ordersTab.getFieldsLocatorForOrderData(field as string)
            )
            .nth(randomOrder)
            .isVisible()
        ).toBe(true);
      });
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0141 - Verify order details are visible in expanded view.", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderCount: number = (await ordersTab.orderListLocator.all()).length;

    if (orderCount > 0) {
      const randomOrder = Math.floor(Math.random() * (orderCount - 0) + 0);

      const orderData: string[] = [];
      // Get data from order
      ordersTabInMyAccountData.dataFieldsInOrder.forEach(async (field) => {
        orderData.push(
          await ordersTab.getElementText(
            page
              .locator(
                await ordersTab.getFieldsLocatorForOrderData(field as string)
              )
              .nth(randomOrder)
          )
        );
      });

      // Click on order for expand view
      await ordersTab.clickElement(ordersTab.orderListLocator.nth(randomOrder));

      await ordersTab.waitForElementVisible(ordersTab.selectPackageDropdown);

      let number = 0;

      // Verify Order data
      for (const field of ordersTabInMyAccountData.dataFieldsInOrder) {
        // Get the field locator dynamically and fetch the text content
        const textContent = await ordersTab.getElementText(
          page.locator(
            await ordersTab.getFieldsLocatorForOrderData(field as string)
          )
        );

        // Compare the text content with the orderData
        expect(textContent).toBe(orderData[number]);

        number++;
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0144 - Verify the number of available guest spots matches the number of packages.", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderCount: number = (await ordersTab.orderListLocator.all()).length;

    if (orderCount > 0) {
      const randomOrder = Math.floor(Math.random() * (orderCount - 0) + 0);

      // Click on order for expand view
      await ordersTab.clickElement(ordersTab.orderListLocator.nth(randomOrder));

      // Get total count for Guest from Select Package dropdown
      const totalCountOfGuest: number =
        await ordersTab.getTotalGuestsFromselectPackageDropdownOption();

      // Get data from "# of Guests"
      const getTextOfNoOfGuestLabel: string = await ordersTab.getElementText(
        page.locator(
          await ordersTab.getFieldsLocatorForOrderData("# of Guests")
        )
      );

      // Get total Guest number from getTextOfNoOfGuestLabel
      const numberOfGuest = parseInt(getTextOfNoOfGuestLabel.split("/")[1]);

      // Verify noOfGuests and TotalCountOfGuest are same
      expect(totalCountOfGuest).toBe(numberOfGuest);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0142 - Verify the status indicator reflects whether guest registration is 100% complete or missing items.", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderCount: number = (await ordersTab.orderListLocator.all()).length;

    if (orderCount > 0) {
      const randomOrder = Math.floor(Math.random() * (orderCount - 0) + 0);

      // Get the status of Guest Registration in collapse view
      const statusInCollapseView =
        await ordersTab.statusIndicatorOfGuestRegistartion
          .nth(randomOrder)
          .getAttribute("stroke");

      // Click on order for expand view
      await ordersTab.clickElement(ordersTab.orderListLocator.nth(randomOrder));

      await ordersTab.waitForElementVisible(ordersTab.selectPackageDropdown);

      // Get the status of Guest Registration in expand view
      const statusInExpandView =
        await ordersTab.statusIndicatorOfGuestRegistartion.getAttribute(
          "stroke"
        );

      // Verify statusInCollapseView and statusInExpandView are same
      expect(statusInCollapseView).toBe(statusInExpandView);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0145 - Verify that guest details gets visible after selecting associated package under Orders.", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderCount: number = (await ordersTab.orderListLocator.all()).length;

    if (orderCount > 0) {
      const randomOrder = Math.floor(Math.random() * (orderCount - 0) + 0);

      // Click on order for expand view
      await ordersTab.clickElement(ordersTab.orderListLocator.nth(randomOrder));

      // Click on Select Package dropdown
      await ordersTab.clickElement(ordersTab.selectPackageDropdown);

      // Select random option from Select Package dropdown
      const selectedOption: null | string =
        await ordersTab.selectRandomItemFromMultiSelectList(
          ordersTab.selectPackageOptionList
        );

      if (selectedOption === null) {
        expect(
          selectedOption,
          "Null value found while retrieving the text of the selected package option."
        ).not.toBeNull();
      } else {
        // Get added Guest details number
        const getNumberMatches = selectedOption.match(/\((\d+)\/(\d+)\)/);

        const addedGuestDetailsNumber: number = getNumberMatches
          ? parseInt(getNumberMatches[1])
          : -1;

        // Verify Guest Details based on find number
        if (addedGuestDetailsNumber == 0) {
          expect(
            await ordersTab.isElementVisible(ordersTab.addGuestButton)
          ).toBe(true);
        } else if (addedGuestDetailsNumber > 0) {
          // Click on Edit / Delete menu button
          await ordersTab.clickElement(ordersTab.editAndDeleteMenuButton);

          // Verify Edit Guest and Delete Guest button is displayed
          expect(
            (await ordersTab.isElementVisible(ordersTab.editGuestButton)) &&
              (await ordersTab.isElementVisible(ordersTab.deleteGuestButton))
          ).toBe(true);
        } else {
          expect(
            addedGuestDetailsNumber,
            "The expected value does not match the selected option text."
          ).not.toBe(-1);
        }
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0143 - Verify the behaviour when guest data is incomplete.", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderCount: number = (
      await ordersTab.incompleteStatusLocatorInCollapseView.all()
    ).length;

    if (orderCount > 0) {
      const randomOrder = Math.floor(Math.random() * (orderCount - 0) + 0);

      // Mouse hover on incomplete Guest information status in Collapse view
      await ordersTab.hoverElement(
        ordersTab.incompleteStatusLocatorInCollapseView.nth(randomOrder)
      );

      // Verify incomplete Guest Information Message
      expect(
        await ordersTab.getElementText(
          ordersTab.incompleteGuestInformationMessageLabel
        )
      ).toBe(ordersTabInMyAccountData.incompleteGuestInformationMessage);

      // Click on element for expand view
      await ordersTab.clickElement(
        ordersTab.incompleteStatusLocatorInCollapseView.nth(randomOrder)
      );

      await ordersTab.waitForElementVisible(ordersTab.selectPackageDropdown);

      // Mouse hover on incomplete Guest information status in Expand view
      await ordersTab.hoverElement(
        ordersTab.incompleteStatusLocatorInExpandView
      );

      // Verify incomplete Guest Information Message
      expect(
        await ordersTab.getElementText(
          ordersTab.incompleteGuestInformationMessageLabel
        )
      ).toBe(ordersTabInMyAccountData.incompleteGuestInformationMessage);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0230 - Verify that blank guest spots are displayed with a call to action to Add Guest", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderExpanded: boolean =
      await ordersTab.expandOrderByStatusOfGuestInformation("Incomplete");

    if (orderExpanded) {
      // Click on Select Package dropdown
      await ordersTab.clickElement(ordersTab.selectPackageDropdown);

      // Select the package where guest information is incomplete.
      await ordersTab.clickOnPackageByStatusOfGuestInformation("Incomplete");

      // Verify Add Guest button is displayed
      expect(await ordersTab.isElementVisible(ordersTab.addGuestButton)).toBe(
        true
      );
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0231 - Verify that populated guest spots are displayed with a call to action to Edit or Delete guest", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    // Get count of visible orders
    const orderExpanded: boolean =
      await ordersTab.expandOrderByStatusOfGuestInformation("Complete");

    if (orderExpanded) {
      // Click on Select Package dropdown
      await ordersTab.clickElement(ordersTab.selectPackageDropdown);

      // Select the package where guest information is incomplete.
      await ordersTab.clickOnPackageByStatusOfGuestInformation("Complete");

      // Click on Edit / Delete menu button
      await ordersTab.clickElement(ordersTab.editAndDeleteMenuButton);

      // Verify Edit Guest and Delete Guest button is displayed
      expect(
        (await ordersTab.isElementVisible(ordersTab.editGuestButton)) &&
          (await ordersTab.isElementVisible(ordersTab.deleteGuestButton))
      ).toBe(true);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0233 - Verify that Guest adding/editing/deleting is disabled when the program is in the past 1", async () => {
  try {
    // Navigate to Orders tab
    await ordersTab.navigateToOrdersTab();

    const expiredOrderFound: boolean =
      await ordersTab.navigateToExpiredProrgramOrder();

    if (expiredOrderFound) {
      // Click on Select Package dropdown
      await ordersTab.clickElement(ordersTab.selectPackageDropdown);

      // Select random option from Select Package dropdown
      const selectedOption: null | string =
        await ordersTab.selectRandomItemFromMultiSelectList(
          ordersTab.selectPackageOptionList
        );

      if (selectedOption === null) {
        expect(
          selectedOption,
          "Null value found while retrieving the text of the selected package option."
        ).not.toBeNull();
      } else {
        // Get added Guest details number
        const getNumberMatches = selectedOption.match(/\((\d+)\/(\d+)\)/);

        const addedGuestDetailsNumber: number = getNumberMatches
          ? parseInt(getNumberMatches[1])
          : -1;

        // Verify Guest Details based on find number
        if (addedGuestDetailsNumber == 0) {
          // Verify Add Guest button is disabled
          expect(
            await ordersTab.isElementDisabled(ordersTab.addGuestButton)
          ).toBe(true);
        } else if (addedGuestDetailsNumber > 0) {
          // Click on Edit / Delete menu button
          await ordersTab.clickElement(ordersTab.editAndDeleteMenuButton);

          // Verify Edit Guest and Delete Guest button is disabled
          expect(
            (await ordersTab.isElementDisabled(ordersTab.editGuestButton)) &&
              (await ordersTab.isElementDisabled(ordersTab.deleteGuestButton))
          ).toBe(true);
        } else {
          expect(
            addedGuestDetailsNumber,
            "The expected value does not match the selected option text."
          ).not.toBe(-1);
        }
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
