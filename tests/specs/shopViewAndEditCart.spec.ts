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
let ViewAndEditCartPage: shopViewAndEditCartPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1780, height: 720 });
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  ViewAndEditCartPage = new shopViewAndEditCartPage(page);
  //Navigation to admin portal
  await basePage.navigateTo(config.soapPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0059 - Verify that the user can access a persistent cart CTA on the microsite, that also shows the number of line items in cart", async () => {
  try {
    // Add multiple package
    const { listOfAddedPackage } =
      await addItemInCartPage.addMultiplePackageInCart();

    // Click on Cart button
    await basePage.clickElement(addItemInCartPage.cartButton);

    // Get actual added package list
    const addedPackagesList: Locator[] =
      await addItemInCartPage.packageTitleInCartPage.all();

    const actualAddedPackageNames: string[] = await Promise.all(
      Array.from({ length: addedPackagesList.length }, (_, i) =>
        addedPackagesList[i].innerText()
      )
    );

    // Verify actual display added package and added package list
    expect([...actualAddedPackageNames].sort()).toEqual(
      [...listOfAddedPackage].sort()
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0060 - Verify the user can edit the cart quantities and remove items from the cart.", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string =
      await addItemInCartPage.addItemInCartPage();

    // Verify My Cart section open or not
    expect(await basePage.isElementVisible(addItemInCartPage.cartSection)).toBe(
      true
    );

    // Verify item added or not in cart page
    expect(
      await addItemInCartPage.packageTitleInCartPage.last().textContent()
    ).toBe(addedPackageName);

    // Edit Quantity
    await basePage.enterValuesInElement(
      addItemInCartPage.packageQuantityField,
      "2"
    );

    // Click on Delete button
    await basePage.clickElement(
      page.locator(await ViewAndEditCartPage.getDelectButton(addedPackageName))
    );

    await basePage.waitForPageToBeReady();

    // Verify Package is remove from cart or not
    expect(
      await page
        .locator(
          await ViewAndEditCartPage.getPackageCardLocator(addedPackageName)
        )
        .isVisible()
    ).toBe(false);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0061 - Verify the user can proceed to checkout or go back to shopping", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string =
      await addItemInCartPage.addItemInCartPage();

    // Verify My Cart section open or not
    expect(await basePage.isElementVisible(addItemInCartPage.cartSection)).toBe(
      true
    );

    // Verify item added or not in cart page
    expect(
      await addItemInCartPage.packageTitleInCartPage.last().textContent()
    ).toBe(addedPackageName);

    // Click on Checkout button
    await basePage.clickElement(ViewAndEditCartPage.checkOutButton);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0128 - Verify that the cart data persists when the user navigates away from the cart page.", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string =
      await addItemInCartPage.addItemInCartPage();

    // Verify My Cart section open or not
    expect(await basePage.isElementVisible(addItemInCartPage.cartSection)).toBe(
      true
    );

    // Verify item added or not in cart page
    expect(
      await addItemInCartPage.packageTitleInCartPage.last().textContent()
    ).toBe(addedPackageName);

    // Edit Quantity
    await basePage.enterValuesInElement(
      page.locator(
        await ViewAndEditCartPage.getPackageQuantityField(addedPackageName)
      ),
      "2"
    );

    if (!(await addItemInCartPage.cartErrorMessage.isVisible())) {
      // Click on "X" button
      await basePage.clickElement(ViewAndEditCartPage.closeCartSectionButton);

      // Open Cart Section
      await basePage.clickElement(addItemInCartPage.cartButton);

      // Verify added quantity of package
      expect(
        await page
          .locator(
            await ViewAndEditCartPage.getPackageQuantityField(addedPackageName)
          )
          .getAttribute("value")
      ).toBe("2");
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
