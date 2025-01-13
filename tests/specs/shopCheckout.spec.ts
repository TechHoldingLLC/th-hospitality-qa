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
import addItemInCartData from "../data/addItemInCartData.json";
import { shopLogoutPage } from "../pageObjects/shopLogoutPage";
import { shopViewAndEditCartPage } from "../pageObjects/shopViewAndEditCartPage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let basePage: BasePage;
let addItemInCartPage: shopAddItemInCartPage;
let logoutPage: shopLogoutPage;
let viewAndEditCartPage: shopViewAndEditCartPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1780, height: 720 });
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  viewAndEditCartPage = new shopViewAndEditCartPage(page);
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
