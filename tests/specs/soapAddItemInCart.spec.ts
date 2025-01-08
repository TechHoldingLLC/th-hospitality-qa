import { test, Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { soapAddItemInCartPage } from "../pageObjects/soapAddItemInCart";
import addItemInCartData from "../data/addItemInCartData.json";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let basePage: BasePage;
let addItemInCartPage: soapAddItemInCartPage;

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
  basePage = new BasePage(page);
  addItemInCartPage = new soapAddItemInCartPage(page);
  //Navigation to admin portal
  await basePage.navigateTo(config.soapPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0119 - Verify the 'Add to Cart' page is empty when a user logs in for the first time", async () => {
  // click on Cart button
  await basePage.clickElement(addItemInCartPage.cartButton);

  // Verify My Cart section open or not
  expect(await basePage.isElementVisible(addItemInCartPage.cartSection)).toBe(
    true
  );

  // Verify Empty Cart title is shown
  expect(
    await basePage.isElementVisible(addItemInCartPage.emptyCartTitle)
  ).toBe(true);

  // Verify Empty Cart Error message is show
  expect(await addItemInCartPage.emptyCartErrorMessage.textContent()).toBe(
    addItemInCartData.emptyCartErrorMessage
  );

  // Verify total amount should be zero
  expect(
    (await addItemInCartPage.totalAmountValueLabel.allInnerTexts()).toString()
  ).toBe("$0.00");
});

test("TC0057 - Verify users can add packages they are interested in to cart and specify the quantity they want to purchase", async () => {
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
    // Open new tab
    const newTab: Page = await browser.newPage();
    const login: adminLoginPage = new adminLoginPage(newTab);
    const addItemInCart: soapAddItemInCartPage = new soapAddItemInCartPage(
      newTab
    );

    // Open admin portal and login
    await newTab.goto(config.adminPortalUrl);
    await login.login(config.email, config.password);

    // Navigate to Packages
    await addItemInCart.packagesButton.click();

    // Get Available Quantity and Max Quantity per order Data
    const { availableQty, maxQtyPerOrder } =
      await addItemInCart.getNumberOfAvialableQtyAndMaxQtyPerOrder(
        addedPackageName
      );

    console.log(availableQty);
    console.log(maxQtyPerOrder);

    await newTab.close();

    const maxNumber: number =
      availableQty < maxQtyPerOrder ? availableQty : maxQtyPerOrder;

    await page.bringToFront();

    // Update Qty in Cart Page
    const quantity = (
      Math.floor(Math.random() * (maxNumber - 1)) + 1
    ).toString();
    await basePage.enterValuesInElement(
      addItemInCartPage.packageQuantityField,
      quantity
    );

    expect(
      await addItemInCartPage.packageQuantityField.getAttribute("value")
    ).toBe(quantity);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0058 - Verify that the maximum quantity as specified on the package is not exceeded", async () => {
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

    // Open new tab
    const newTab: Page = await browser.newPage();
    const login: adminLoginPage = new adminLoginPage(newTab);
    const addItemInCart: soapAddItemInCartPage = new soapAddItemInCartPage(
      newTab
    );

    // Open admin portal and login
    await newTab.goto(config.adminPortalUrl);
    await login.login(config.email, config.password);

    // Navigate to Packages
    await addItemInCart.packagesButton.click();

    // Get Available Quantity and Max Quantity per order Data
    const { availableQty, maxQtyPerOrder } =
      await addItemInCart.getNumberOfAvialableQtyAndMaxQtyPerOrder(
        addedPackageName
      );

    console.log(availableQty);
    console.log(maxQtyPerOrder);

    await newTab.close();

    await page.bringToFront();

    // Try to add above max quantity per order package and validation message should display
    await basePage.enterValuesInElement(
      addItemInCartPage.packageQuantityField,
      (maxQtyPerOrder + 1).toString()
    );

    expect(await addItemInCartPage.cartErrorMessage.textContent()).toBe(
      addItemInCartData.cartMaxQuantityErrorMessage +
        maxQtyPerOrder.toString() +
        "."
    );
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

invalidValueListForQuantityField.forEach((inputValues) => {
  test.only(
    "TC0125 - Verify that application validates invalid input " +
      inputValues.inValidValue +
      " in to quantity field under cart page",
    async () => {
      // Click on View Package button
      await basePage.selectRandomItemFromMultiSelectList(
        addItemInCartPage.viewPackageButton
      );

      await basePage.waitForPageToBeReady();

      // Enter value in quantity field
      await basePage.enterValuesInElement(
        addItemInCartPage.quantityInputField,
        inputValues.inValidValue.toString()
      );

      // Verify error message
      if (inputValues.inValidValue == Number.MAX_SAFE_INTEGER) {
        expect(
          await addItemInCartPage.emptyCartErrorMessage.textContent()
        ).toContain(addItemInCartData.cartMaxQuantityErrorMessage);
      } else {
        expect(
          await addItemInCartPage.emptyCartErrorMessage.textContent()
        ).toBe(addItemInCartData.invalidInputValueMessage);
      }
    }
  );
});
