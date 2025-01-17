import { test, Browser, Page, chromium, expect } from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { shopAddItemInCartPage } from "../pageObjects/shopAddItemInCart";
import addItemInCartData from "../data/addItemInCartData.json";
import { shopLogoutPage } from "../pageObjects/shopLogoutPage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let addItemInCartPage: shopAddItemInCartPage;
let logoutPage: shopLogoutPage;

let invalidValueListForQuantityField = [
  { inValidValue: 0 },
  { inValidValue: -1 },
  { inValidValue: Number.MAX_SAFE_INTEGER },
];

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1780, height: 720 });
  loginPage = new adminLoginPage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  //Navigation to admin portal
  await addItemInCartPage.navigateTo(config.shopPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0119 - Verify the 'Add to Cart' page is empty when a user logs in for the first time", async () => {
  try {
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
    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      await addItemInCartPage.waitForElementVisible(
        addItemInCartPage.cartSection
      );

      // Verify package is added to the cart
      expect(
        await addItemInCartPage.packageTitleInCartPage.last().textContent()
      ).toBe(addedPackageName);

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
        addItemInCartPage.packageQuantityField,
        quantity
      );

      expect(
        await addItemInCartPage.packageQuantityField.getAttribute("value")
      ).toBe(quantity);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0058 - Verify that the maximum quantity as specified on the package is not exceeded", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      await addItemInCartPage.waitForElementVisible(
        addItemInCartPage.cartSection
      );

      // Verify package is added to the cart
      expect(
        await addItemInCartPage.packageTitleInCartPage.last().textContent()
      ).toBe(addedPackageName);

      // Get Available Quantity and Max Quantity per order Data
      const { availableQty, maxQtyPerOrder } =
        await addItemInCartPage.getNumberOfAvialableQtyAndMaxQtyPerOrderFromAdmin(
          addedPackageName
        );

      await page.bringToFront();

      // Try to add quantity above max quantity per order package and verify validation message appears
      await addItemInCartPage.enterValuesInElement(
        addItemInCartPage.packageQuantityField,
        (maxQtyPerOrder + 1).toString()
      );

      if (availableQty > maxQtyPerOrder) {
        expect(await addItemInCartPage.cartErrorMessage.textContent()).toBe(
          addItemInCartData.cartMaxQuantityErrorMessage +
            maxQtyPerOrder.toString() +
            "."
        );
      } else {
        expect(await addItemInCartPage.cartErrorMessage.textContent()).toBe(
          addItemInCartData.maximumAvailableQtyMessage +
            availableQty.toString() +
            "."
        );
      }
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

invalidValueListForQuantityField.forEach((inputValues) => {
  test(
    "TC0125 - Verify that application validates invalid input " +
      inputValues.inValidValue +
      " in to quantity field under cart page",
    async () => {
      try {
        // Click on View Package button
        await addItemInCartPage.selectRandomItemFromMultiSelectList(
          addItemInCartPage.viewPackageButton
        );

        await addItemInCartPage.waitForPageToBeReady();

        // Enter value in quantity field
        await addItemInCartPage.enterValuesInElement(
          addItemInCartPage.quantityInputField,
          inputValues.inValidValue.toString()
        );

        // Verify error message
        if (inputValues.inValidValue == Number.MAX_SAFE_INTEGER) {
          const errorMessage = await addItemInCartPage.getElementText(
            addItemInCartPage.emptyCartErrorMessage
          );

          expect(
            errorMessage.includes(
              addItemInCartData.cartMaxQuantityErrorMessage
            ) ||
              errorMessage.includes(
                addItemInCartData.maximumAvailableQtyMessage
              )
          ).toBe(true);
        } else {
          expect(
            await addItemInCartPage.emptyCartErrorMessage.textContent()
          ).toBe(addItemInCartData.invalidInputValueMessage);
        }
      } catch (error: any) {
        console.error(`Test failed: ${error.message}`);
        throw error;
      }
    }
  );
});

test("TC0126 - Verify that items in the cart are retained after the user logs out and logs back in.", async () => {
  try {
    // Add Package in cart and verify
    const addedPackageName: string = await addItemInCartPage.addItemInCart();

    if (addedPackageName != "") {
      await addItemInCartPage.waitForElementVisible(
        addItemInCartPage.cartSection
      );

      // Verify package is added to the cart
      expect(
        await addItemInCartPage.packageTitleInCartPage.last().textContent()
      ).toBe(addedPackageName);

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

      await addItemInCartPage.isElementVisible(addItemInCartPage.cartSection);

      // Verify item is added to cart
      expect(
        await addItemInCartPage.packageTitleInCartPage.last().textContent()
      ).toBe(addedPackageName);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0127 - Verify that 'Total Amount' displayed correct values when multiple packages been added to cart", async () => {
  try {
    test.setTimeout(120000);

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
