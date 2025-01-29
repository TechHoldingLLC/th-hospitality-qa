import {
  test,
  Browser,
  Page,
  chromium,
  expect,
  Locator,
} from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config, EventType } from "../config/config.qa";
import { shopAddItemInCartPage } from "../pageObjects/shopAddItemInCart";
import { shopViewAndEditCartPage } from "../pageObjects/shopViewAndEditCartPage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let addItemInCartPage: shopAddItemInCartPage;
let viewAndEditCartPage: shopViewAndEditCartPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  loginPage = new adminLoginPage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  viewAndEditCartPage = new shopViewAndEditCartPage(page);

  // Navigation to shop portal
  await viewAndEditCartPage.navigateTo(config.shopPortalUrl);
  // Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0059 - Verify that the user can access a persistent cart CTA on the microsite, that also shows the number of line items in cart", async () => {
  try {
    test.setTimeout(90000);

    // Clear cart
    await addItemInCartPage.clearCart();

    // Add multiple packages
    const { listOfAddedPackage } =
      await addItemInCartPage.addMultiplePackagesToCart();

    // Click on Cart button
    await viewAndEditCartPage.clickElement(addItemInCartPage.cartButton);

    // Get actual added package list
    const addedPackagesList: Locator[] =
      await viewAndEditCartPage.packageTitleInCartPage.all();

    const actualAddedPackageNames: string[] = await Promise.all(
      Array.from({ length: addedPackagesList.length }, (_, i) =>
        addedPackagesList[i].innerText()
      )
    );

    // Verify the displayed packages and the list of added packages
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
    // Check if the event type is multiple event than expand any one event
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      // Wait until the package is added to the cart
      await viewAndEditCartPage.waitForElementVisible(
        page.locator(
          await addItemInCartPage.getPackageTitleLocatorInCartPage(
            addedPackageName
          )
        )
      );

      // Edit Quantity and Click on remove button
      await viewAndEditCartPage.editQtyAndRemovePackage(addedPackageName);

      // Verify Package is removed from cart
      expect(
        await page
          .locator(
            await viewAndEditCartPage.getPackageCardLocator(addedPackageName)
          )
          .count()
      ).toBe(0);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0061 - Verify the user can proceed to checkout or go back to shopping", async () => {
  try {
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      // Wait until the package is added to the cart
      await viewAndEditCartPage.waitForElementVisible(
        page.locator(
          await addItemInCartPage.getPackageTitleLocatorInCartPage(
            addedPackageName
          )
        )
      );

      // Click on Checkout button
      await viewAndEditCartPage.clickElement(
        viewAndEditCartPage.checkOutButton
      );

      // Click on Back to shopping cart button
      await viewAndEditCartPage.clickElement(
        viewAndEditCartPage.backToCartPageButton
      );

      // Click on "X" button
      await viewAndEditCartPage.clickElement(
        viewAndEditCartPage.closeCartSectionButton
      );

      // Verify Cart section is closed
      expect(await addItemInCartPage.cartButton.isVisible()).toBe(true);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0128 - Verify that the cart data persists when the user navigates away from the cart page.", async () => {
  try {
    // Add Package in cart and verify
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      // Wait until the package is added to the cart
      await viewAndEditCartPage.waitForElementVisible(
        page.locator(
          await addItemInCartPage.getPackageTitleLocatorInCartPage(
            addedPackageName
          )
        )
      );

      // Edit Quantity
      await viewAndEditCartPage.enterValuesInElement(
        page.locator(
          await viewAndEditCartPage.getPackageQuantityField(addedPackageName)
        ),
        "2"
      );

      await page.keyboard.press("Tab");
      await viewAndEditCartPage.waitForPageToBeReady();

      if (!((await addItemInCartPage.cartErrorMessage.count()) == 0)) {
        // Click on "X" button
        await viewAndEditCartPage.clickElement(
          viewAndEditCartPage.closeCartSectionButton
        );

        // Open Cart Section
        await viewAndEditCartPage.clickElement(addItemInCartPage.cartButton);

        // Verify added quantity of package
        expect(
          await page
            .locator(
              await viewAndEditCartPage.getPackageQuantityField(
                addedPackageName
              )
            )
            .getAttribute("value")
        ).toBe("2");
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0129 - Verify that the cart functions correctly with a large number of items.", async () => {
  try {
    test.setTimeout(900000); // Setting timeout for this specific test

    await viewAndEditCartPage.waitForElementVisible(
      addItemInCartPage.cartButton
    );

    // Add all available package in cart
    let listOfAddedPackage: string[] = [];
    if (config.eventType == EventType.multipleEvent)
      listOfAddedPackage.push(
        ...(await addItemInCartPage.addAllPackageInCartForMultipleEvent())
      );
    else
      listOfAddedPackage.push(
        ...(await addItemInCartPage.addAllPackageInCart())
      );

    listOfAddedPackage = [...new Set(listOfAddedPackage)];

    // Click on Cart button
    await viewAndEditCartPage.clickElement(addItemInCartPage.cartButton);
    await viewAndEditCartPage.isElementVisible(addItemInCartPage.cartSection);

    for (const addedPackageName of listOfAddedPackage) {
      // Verify item is added in cart page
      expect(
        await page
          .locator(
            await viewAndEditCartPage.getPackageCardLocator(addedPackageName)
          )
          .isVisible()
      ).toBe(true);

      // Edit Quantity and Click on remove button
      await viewAndEditCartPage.editQtyAndRemovePackage(addedPackageName);

      // Verify Package is removed from cart
      expect(
        await page
          .locator(
            await viewAndEditCartPage.getPackageCardLocator(addedPackageName)
          )
          .count()
      ).toBe(0);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
