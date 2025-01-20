import {
  test,
  Browser,
  Page,
  chromium,
  expect,
  Locator,
} from "@playwright/test";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { shopAddItemInCartPage } from "../pageObjects/shopAddItemInCart";
import { shopViewAndEditCartPage } from "../pageObjects/shopViewAndEditCartPage";
import { shopCheckoutPage } from "../pageObjects/shopCheckoutPage";
import checkoutData from "../data/checkoutData.json";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let addItemInCartPage: shopAddItemInCartPage;
let viewAndEditCartPage: shopViewAndEditCartPage;
let checkoutPage: shopCheckoutPage;
let addedPackageName: string;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  await page.setViewportSize({ width: 1780, height: 720 });
  loginPage = new adminLoginPage(page);
  addItemInCartPage = new shopAddItemInCartPage(page);
  checkoutPage = new shopCheckoutPage(page);

  //Navigation to admin portal
  await checkoutPage.navigateTo(config.soapPortalUrl);
  //Login
  await loginPage.login(config.coordinator_email, config.coordinator_password);

  // Add Package in cart and verify
  addedPackageName = await addItemInCartPage.addItemInCartPage();

  if (addedPackageName != "") {
    // Verify My Cart section is opened
    expect(
      await checkoutPage.isElementVisible(addItemInCartPage.cartSection)
    ).toBe(true);

    // Verify item is added in cart page
    expect(
      await addItemInCartPage.packageTitleInCartPage.last().textContent()
    ).toBe(addedPackageName);

    // Click on Checkout button
    await checkoutPage.clickElement(viewAndEditCartPage.checkOutButton);

    await checkoutPage.isElementVisible(
      viewAndEditCartPage.checkoutPageTitleLabel
    );
  }
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0130 - Verify that the user can access the checkout flow.", async () => {
  try {
    // Verify successfully navigate to Checkout page
    expect(
      await checkoutPage.isElementVisible(
        viewAndEditCartPage.backToCartPageButton
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0131 - Verify that that Section 1 of the form displays required fields correctly.", async () => {
  try {
    if (addedPackageName != "") {
      // Enter data in Approval and Purpose section
      await checkoutPage.fillApprovalAndPurposeSection();

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify error message for the required fields are not displayed
      checkoutData.approvalAndPurposeSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutPage.getErrorMessageElementForFields(
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

test("TC0132 - Verify that that Section 2a is displayed and functions correctly for the Third-Party order purpose.", async () => {
  try {
    if (addedPackageName != "") {
      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter data in Department Information section
      await checkoutPage.fillDepartmentInformationSection();

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify error message for the required fields are not displayed
      checkoutData.departmentInformationSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutPage.getErrorMessageElementForFields(
                field.fieldName as string
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

test("TC0133 - Verify that that Section 2b is displayed and functions correctly for the 'TCCC' order purpose.", async () => {
  try {
    if (addedPackageName != "") {
      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "Third-Party"
      );

      // Enter data in Compnay Information section
      await checkoutPage.fillCompanyInformationSection();

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify error message for the required fields are not displayed
      checkoutData.companyInformationSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutPage.getErrorMessageElementForFields(
                field.fieldName as string
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

test("TC0134 - Verify that that the terms and conditions section is displayed and functional.", async () => {
  try {
    if (addedPackageName != "") {
      // Select all checkbox in Terms and Conditions section
      await checkoutPage.fillTermsAndConditionsSectionOne();

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify error message for the required fields are not displayed
      expect(
        (await page
          .locator(
            await checkoutPage.getErrorMessageElementForCheckBoxFields(
              checkoutData.termsAndConditionsSection[0].fieldName as string
            )
          )
          .isVisible()) &&
          (await page
            .locator(
              await checkoutPage.getErrorMessageElementForCheckBoxFields(
                checkoutData.termsAndConditionsSection[1].fieldName as string
              )
            )
            .isVisible()) &&
          (await page
            .locator(
              await checkoutPage.getErrorMessageElementForCheckBoxFields(
                checkoutData.termsAndConditionsSection[2].fieldName as string
              )
            )
            .isVisible())
      ).toBe(false);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0135 - Verify that that the legal entity dropdown is functional and required for submission", async () => {
  try {
    if (addedPackageName != "") {
      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify error message for the required field is displayed
      expect(
        await page
          .locator(
            await checkoutPage.getErrorMessageElementForFields(
              checkoutData.termsAndConditionsSection[3].fieldName as string
            )
          )
          .isVisible()
      ).toBe(true);

      // Enter data in Terms and Condition section
      await checkoutPage.fillTermsAndConditionsSectionTwo();

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify error message for the required field is not displayed
      expect(
        await page
          .locator(
            await checkoutPage.getErrorMessageElementForFields(
              checkoutData.termsAndConditionsSection[3].fieldName as string
            )
          )
          .isVisible()
      ).toBe(false);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0138 - Verify that appropriate error messages are displayed for missing input.", async () => {
  try {
    if (addedPackageName != "") {
      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify fields required message are displayed
      checkoutData.approvalAndPurposeSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutPage.getErrorMessageElementForFields(
                field.fieldName as string
              )
            )
            .textContent()
        ).toBe(field.emptyFieldMessage as string);
      });

      for (let int = 0; int < 3; int++) {
        expect(
          await page
            .locator(
              await checkoutPage.getErrorMessageElementForCheckBoxFields(
                checkoutData.termsAndConditionsSection[int].fieldName as string
              )
            )
            .textContent()
        ).toBe(
          checkoutData.termsAndConditionsSection[int]
            .emptyFieldMessage as string
        );
      }

      expect(
        await page
          .locator(
            await checkoutPage.getErrorMessageElementForFields(
              checkoutData.termsAndConditionsSection[3].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.termsAndConditionsSection[3].emptyFieldMessage as string
      );

      // Select TCCC option from order purpose dropdown
      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "TCCC"
      );

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify fields required message are displayed in Department Information section
      checkoutData.departmentInformationSection.forEach(async (field) => {
        if (field.emptyFieldMessage) {
          expect(
            await page
              .locator(
                await checkoutPage.getErrorMessageElementForFields(
                  field.fieldName as string
                )
              )
              .textContent()
          ).toBe(field.emptyFieldMessage as string);
        }
      });

      // Select Third Party option from order purpose dropdown
      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "Third-Party"
      );

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify fields required message are displayed in Company Information section
      checkoutData.companyInformationSection.forEach(async (field) => {
        if (field.emptyFieldMessage) {
          expect(
            await page
              .locator(
                await checkoutPage.getErrorMessageElementForFields(
                  field.fieldName as string
                )
              )
              .textContent()
          ).toBe(field.emptyFieldMessage as string);
        }
      });
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0138 - Verify that appropriate error messages are displayed for invalid input.", async () => {
  try {
    if (addedPackageName != "") {
      // Enter invalid data in approving manager email field
      await checkoutPage.enterValuesInElement(
        checkoutPage.approvingManagerEmailField,
        checkoutData.approvalAndPurposeSection[1].invalidData as string
      );

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify invalid email address message is displayed
      expect(
        await page
          .locator(
            await checkoutPage.getErrorMessageElementForFields(
              checkoutData.approvalAndPurposeSection[1].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.approvalAndPurposeSection[1].invalidDataMessage as string
      );

      // Select TCCC option from order purpose dropdown
      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter invalid data in Finance Contact Email field
      await checkoutPage.enterValuesInElement(
        checkoutPage.financeContactEmailField,
        checkoutData.departmentInformationSection[3].invalidData as string
      );

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify invalid email address message is displayed
      expect(
        await page
          .locator(
            await checkoutPage.getErrorMessageElementForFields(
              checkoutData.departmentInformationSection[3].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.departmentInformationSection[3]
          .invalidDataMessage as string
      );

      // Select Third Party option from order purpose dropdown
      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "Third-Party"
      );

      // Enter invaid data in Account Payable Contact Email field
      await checkoutPage.enterValuesInElement(
        checkoutPage.accountPayableContactEmailField,
        checkoutData.companyInformationSection[3].invalidData as string
      );

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify invalid email address message is displayed
      expect(
        await page
          .locator(
            await checkoutPage.getErrorMessageElementForFields(
              checkoutData.companyInformationSection[3].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.companyInformationSection[3].invalidDataMessage as string
      );
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0136 - Verify that an order is created in 'Pending' status upon checkout completion.", async () => {
  try {
    test.setTimeout(90000);

    if (addedPackageName != "") {
      // Open new tab
      const newTab: Page = await browser.newPage();
      const login: adminLoginPage = new adminLoginPage(newTab);
      const checkoutPageNew: shopCheckoutPage = new shopCheckoutPage(newTab);

      // Open shop portal
      await newTab.goto(config.soapPortalUrl);

      //Login
      await login.login(config.coordinator_email, config.coordinator_password);

      // Navigate to Order page
      await checkoutPageNew.navigatetoOrderpage();

      // Get Order ID list
      const orderIDList: string[] = await checkoutPageNew.getOrderIDList();

      await newTab.close();

      // Enter data in Approval and Purpose section
      await checkoutPage.fillApprovalAndPurposeSection();

      await checkoutPage.selectOptionFromDropdown(
        checkoutPage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter data in Department Information section
      await checkoutPage.fillDepartmentInformationSection();

      // Select all checkbox in Terms and Conditions section
      await checkoutPage.fillTermsAndConditionsSectionOne();

      // Enter data in Terms and Condition section
      await checkoutPage.fillTermsAndConditionsSectionTwo();

      // Click on submit button
      await checkoutPage.clickElement(checkoutPage.submitButton);

      // Verify Order success and Payment Intiated message are displayed
      expect(
        (await checkoutPage.isElementVisible(
          checkoutPage.paymentInitiatedMessage
        )) &&
          (await checkoutPage.isElementVisible(
            checkoutPage.orderSuccessMessage
          ))
      ).toBe(true);

      // Verify directly navigate to My account page
      expect(
        await checkoutPage.isElementVisible(checkoutPage.myAccountLabel)
      ).toBe(true);

      // Get Order ID list
      const orderNewIDList: string[] = await checkoutPage.getOrderIDList();

      // Find new order id
      const uniqueValue = orderNewIDList.filter(
        (element) => !orderIDList.includes(element)
      );

      // Verify new order id is found
      expect(uniqueValue.length).toBe(1);
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});