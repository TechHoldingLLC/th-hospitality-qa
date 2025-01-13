import {
  test,
  Browser,
  Page,
  chromium,
  expect,
  Locator,
} from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { shopAddItemInCartPage } from "../pageObjects/shopAddItemInCart";
import { shopViewAndEditCartPage } from "../pageObjects/shopViewAndEditCartPage";
import { shopCheckoutPage } from "../pageObjects/shopCheckoutPage";
import checkoutData from "../data/checkoutData.json";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let basePage: BasePage;
let addItemInCartPage: shopAddItemInCartPage;
let viewAndEditCartPage: shopViewAndEditCartPage;
let checkoutpage: shopCheckoutPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1780, height: 720 });
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  viewAndEditCartPage = new shopViewAndEditCartPage(page);
  checkoutpage = new shopCheckoutPage(page);

  //Navigation to admin portal
  await basePage.navigateTo(config.soapPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0130 - Verify that the user can access the checkout flow.", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string =
      await addItemInCartPage.addItemInCartPage();

    if (addedPackageName != "") {
      // Verify My Cart section open or not
      expect(
        await basePage.isElementVisible(addItemInCartPage.cartSection)
      ).toBe(true);

      // Verify item added or not in cart page
      expect(
        await addItemInCartPage.packageTitleInCartPage.last().textContent()
      ).toBe(addedPackageName);

      // Click on Checkout button
      await basePage.clickElement(viewAndEditCartPage.checkOutButton);

      // Verify navigate to Checkout page
      expect(
        await basePage.isElementVisible(
          viewAndEditCartPage.checkoutPageTitleLabel
        )
      ).toBe(true);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test.only("TC0131 - Verify that that Section 1 of the form displays required fields correctly.", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string =
      await addItemInCartPage.addItemInCartPage();

    if (addedPackageName != "") {
      // Verify My Cart section open or not
      expect(
        await basePage.isElementVisible(addItemInCartPage.cartSection)
      ).toBe(true);

      // Verify item added or not in cart page
      expect(
        await addItemInCartPage.packageTitleInCartPage.last().textContent()
      ).toBe(addedPackageName);

      // Click on Checkout button
      await basePage.clickElement(viewAndEditCartPage.checkOutButton);

      // Verify navigate to Checkout page
      expect(
        await basePage.isElementVisible(
          viewAndEditCartPage.checkoutPageTitleLabel
        )
      ).toBe(true);

      // Enter name in approving manager name field
      await basePage.enterValuesInElement(
        checkoutpage.approvingManagerNameField,
        "Testing"
      );

      // Enter email in approving manager email field
      await basePage.enterValuesInElement(
        checkoutpage.approvingManagerEmailField,
        "testing@test.com"
      );

      // Enter data in Intended business use of Requested Packages field
      await basePage.enterValuesInElement(
        checkoutpage.requestedPackagesField,
        "This is testing purpose"
      );

      // Select random option from Intended Invitee Category dropdown
      await basePage.clickOnRandomOptionFromDropdown(
        checkoutpage.intendedInviteeCategoryDropdown
      );

      // Select option from Order Purpose dropdown
      await basePage.clickOnRandomOptionFromDropdown(
        checkoutpage.orderPurposeDropdown
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      checkoutData.approvalAndPurposeSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutpage.getErrorMessageElementForFields(
                field.fieldName.toString()
              )
            )
            .isVisible()
        ).toBe(false);
      });
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
