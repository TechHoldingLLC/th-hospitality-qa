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

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let basePage: BasePage;
let addItemInCartPage: shopAddItemInCartPage;
let logoutPage: shopLogoutPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1780, height: 720 });
  loginPage = new adminLoginPage(page);
  basePage = new BasePage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  //Navigation to admin portal
  await basePage.navigateTo(config.soapPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0059 - Verify that the user can access a persistent cart CTA on the microsite, that also shows the number of line items in cart", async () => {
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
});
