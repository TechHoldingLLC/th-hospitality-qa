import { test, Browser, Page, chromium, expect } from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config, EventType } from "../config/config.qa";
import { shopAddItemInCartPage } from "../pageObjects/shopAddItemInCart";
import addItemInCartData from "../data/addItemInCartData.json";
import createAccountData from "../data/createAccountData.json";
import { shopLogoutPage } from "../pageObjects/shopLogoutPage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let addItemInCartPage: shopAddItemInCartPage;
let logoutPage: shopLogoutPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  loginPage = new adminLoginPage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);

  // Navigation to shop portal
  await addItemInCartPage.navigateTo(config.shopPortalUrl);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0119 - Verify the 'Add to Cart' page is empty when a user logs in for the first time", async () => {
  try {
    // Login with new user
    await loginPage.login(
      createAccountData.coordinatorInviteEmail,
      createAccountData.password
    );

    // click on Cart button
    await addItemInCartPage.clickElement(addItemInCartPage.cartButton);

    await addItemInCartPage.waitForElementVisible(
      addItemInCartPage.cartSection
    );

    // Verify Empty Cart title is shown
    expect(
      await addItemInCartPage.isElementVisible(addItemInCartPage.emptyCartTitle)
    ).toBe(true);

    // Verify Empty Cart Error message is show
    expect(await addItemInCartPage.emptyCartErrorMessage.textContent()).toBe(
      addItemInCartData.emptyCartErrorMessage
    );

    // Verify total amount should be zero
    expect(
      (await addItemInCartPage.totalAmountValueLabel.allInnerTexts()).toString()
    ).toBe("$0.00");
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0057 - Verify users can add packages they are interested in to cart and specify the quantity they want to purchase", async () => {
  try {
    test.setTimeout(90000);

    // Login
    await loginPage.login(
      config.coordinator_email,
      config.coordinator_password
    );

    // Check if the event type is multiple event than expand any one event
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      await addItemInCartPage.waitForElementVisible(
        addItemInCartPage.cartSection
      );

      // Verify package is added to the cart
      expect(
        await page
          .locator(
            await addItemInCartPage.getPackageTitleLocatorInCartPage(
              addedPackageName
            )
          )
          .isVisible()
      ).toBe(true);

      // Get Available Quantity and Max Quantity per order Data
      const { availableQty, maxQtyPerOrder } =
        await addItemInCartPage.getNumberOfAvialableQtyAndMaxQtyPerOrderFromAdmin(
          addedPackageName
        );

      const maxNumber: number =
        availableQty < maxQtyPerOrder ? availableQty : maxQtyPerOrder;

      await page.bringToFront();

      // Update Qty in Cart Page
      const quantity = (
        Math.floor(Math.random() * (maxNumber - 1)) + 1
      ).toString();

      await addItemInCartPage.enterValuesInElement(
        page.locator(
          await addItemInCartPage.getPackageQuantityField(addedPackageName)
        ),
        quantity
      );

      await page.keyboard.press("Tab");

      // Verify quantity is updated
      expect(
        await page
          .locator(
            await addItemInCartPage.getPackageQuantityField(addedPackageName)
          )
          .getAttribute("value")
      ).toBe(quantity);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0058 - Verify that the maximum quantity as specified on the package is not exceeded", async () => {
  try {
    test.setTimeout(90000);

    // Login
    await loginPage.login(
      config.coordinator_email,
      config.coordinator_password
    );

    // Check if the event type is multiple event than expand any one event
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      await addItemInCartPage.waitForElementVisible(
        addItemInCartPage.cartSection
      );

      // Verify package is added to the cart
      expect(
        await page
          .locator(
            await addItemInCartPage.getPackageTitleLocatorInCartPage(
              addedPackageName
            )
          )
          .isVisible()
      ).toBe(true);

      // Get Available Quantity and Max Quantity per order Data
      const { availableQty, maxQtyPerOrder } =
        await addItemInCartPage.getNumberOfAvialableQtyAndMaxQtyPerOrderFromAdmin(
          addedPackageName
        );

      await page.bringToFront();

      // Try to add quantity above max quantity per order package and verify validation message appears
      await addItemInCartPage.enterValuesInElement(
        page.locator(
          await addItemInCartPage.getPackageQuantityField(addedPackageName)
        ),
        (maxQtyPerOrder + 1).toString()
      );

      // Verify error message
      const expectedMessage =
        availableQty != maxQtyPerOrder && availableQty > maxQtyPerOrder
          ? addItemInCartData.cartMaxQuantityErrorMessage +
            maxQtyPerOrder.toString() +
            "."
          : addItemInCartData.maximumAvailableQtyMessage +
            availableQty.toString() +
            ".";

      expect(await addItemInCartPage.cartErrorMessage.textContent()).toBe(
        expectedMessage
      );
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0125 - Verify that application validates invalid input in to quantity field under cart page", async () => {
  try {
    // Login
    await loginPage.login(
      config.coordinator_email,
      config.coordinator_password
    );

    // Check if the event type is multiple event than expand any one event
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Open Package details pop up and enter "0" value in quantity field
    await addItemInCartPage.editQuantityInPackageDetailsPopup("0");

    // Verify Error message
    expect(
      await addItemInCartPage.getElementText(
        addItemInCartPage.emptyCartErrorMessage
      )
    ).toBe(addItemInCartData.invalidInputValueMessage);

    // Enter "-1" value in quantity field
    await addItemInCartPage.enterValuesInElement(
      addItemInCartPage.quantityInputField,
      "-1"
    );

    // Verify Error message
    expect(
      await addItemInCartPage.getElementText(
        addItemInCartPage.emptyCartErrorMessage
      )
    ).toBe(addItemInCartData.invalidInputValueMessage);

    // Enter max integer value in quantity field
    await addItemInCartPage.enterValuesInElement(
      addItemInCartPage.quantityInputField,
      Number.MAX_SAFE_INTEGER.toString()
    );

    const errorMessage: string = await addItemInCartPage.getElementText(
      addItemInCartPage.emptyCartErrorMessage
    );

    // Verify Error message
    expect(
      errorMessage.includes(addItemInCartData.cartMaxQuantityErrorMessage) ||
        errorMessage.includes(addItemInCartData.maximumAvailableQtyMessage)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0126 - Verify that items in the cart are retained after the user logs out and logs back in.", async () => {
  try {
    // Login
    await loginPage.login(
      config.coordinator_email,
      config.coordinator_password
    );

    // Check if the event type is multiple event than expand any one event
    if (!addItemInCartPage.expandEventForMultipleType()) {
      return;
    }

    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      // Verify package is added to the cart
      expect(
        await addItemInCartPage.isElementVisible(
          page.locator(
            await addItemInCartPage.getPackageTitleLocatorInCartPage(
              addedPackageName
            )
          )
        )
      ).toBe(true);

      // Close cart popup
      await addItemInCartPage.clickElement(
        addItemInCartPage.closeCartDrawerButton
      );

      // Log out from portal
      logoutPage = new shopLogoutPage(page);
      logoutPage.logout();

      await addItemInCartPage.waitForPageToBeReady();

      // Login into portal
      await loginPage.login(
        config.coordinator_email,
        config.coordinator_password
      );

      // click on Cart button
      await addItemInCartPage.clickElement(addItemInCartPage.cartButton);

      // Verify item is added to cart
      expect(
        await addItemInCartPage.isElementVisible(
          page.locator(
            await addItemInCartPage.getPackageTitleLocatorInCartPage(
              addedPackageName
            )
          )
        )
      ).toBe(true);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0127 - Verify that 'Total Amount' displayed correct values when multiple packages been added to cart", async () => {
  try {
    test.setTimeout(120000);

    // Login
    await loginPage.login(
      config.coordinator_email,
      config.coordinator_password
    );

    // Clear cart
    await addItemInCartPage.clearCart();

    // Add multiple package
    const totalPrice: number =
      await addItemInCartPage.addMultiplePackagesToCart();

    // Click on Cart button
    await addItemInCartPage.clickElement(addItemInCartPage.cartButton);

    // Verify total amount
    expect(
      (await addItemInCartPage.totalAmountValueLabel.allInnerTexts()).toString()
    ).toContain("$" + totalPrice.toString());
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
