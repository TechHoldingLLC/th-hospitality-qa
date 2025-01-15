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
import exp from "constants";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let basePage: BasePage;
let addItemInCartPage: shopAddItemInCartPage;
let viewAndEditCartPage: shopViewAndEditCartPage;
let checkoutpage: shopCheckoutPage;
let addedPackageName: string;

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

  // Add Package in cart and verify
  addedPackageName = await addItemInCartPage.addItemInCartPage();

  if (addedPackageName != "") {
    // Verify My Cart section open or not
    expect(await basePage.isElementVisible(addItemInCartPage.cartSection)).toBe(
      true
    );

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
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0130 - Verify that the user can access the checkout flow.", async () => {
  try {
    // Verify successfully navigate to Checkout page
    expect(
      await basePage.isElementVisible(viewAndEditCartPage.backToCartPageButton)
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
      await checkoutpage.fillApprovalAndPurposeSection();

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

test("TC0132 - Verify that that Section 2a is displayed and functions correctly for the Third-Party order purpose.", async () => {
  try {
    if (addedPackageName != "") {
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter data in Department Information section
      await checkoutpage.fillDepartmentInformationSection();

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      checkoutData.departmentInformationSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutpage.getErrorMessageElementForFields(
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
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "Third-Party"
      );

      // Enter data in Compnay Information section
      await checkoutpage.fillCompanyInformationSection();

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      checkoutData.companyInformationSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutpage.getErrorMessageElementForFields(
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
      await checkoutpage.fillTermsAndConditionsSectionOne();

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      expect(
        (await page
          .locator(
            await checkoutpage.getErrorMessageElementForCheckBoxFields(
              checkoutData.termsAndConditionsSection[0].fieldName as string
            )
          )
          .isVisible()) &&
          (await page
            .locator(
              await checkoutpage.getErrorMessageElementForCheckBoxFields(
                checkoutData.termsAndConditionsSection[1].fieldName as string
              )
            )
            .isVisible()) &&
          (await page
            .locator(
              await checkoutpage.getErrorMessageElementForCheckBoxFields(
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
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message display
      expect(
        await page
          .locator(
            await checkoutpage.getErrorMessageElementForFields(
              checkoutData.termsAndConditionsSection[3].fieldName as string
            )
          )
          .isVisible()
      ).toBe(true);

      // Enter data in Terms and Condition section
      await checkoutpage.fillTermsAndConditionsSectionTwo();

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      expect(
        await page
          .locator(
            await checkoutpage.getErrorMessageElementForFields(
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
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields required message are display or not
      checkoutData.approvalAndPurposeSection.forEach(async (field) => {
        expect(
          await page
            .locator(
              await checkoutpage.getErrorMessageElementForFields(
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
              await checkoutpage.getErrorMessageElementForCheckBoxFields(
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
            await checkoutpage.getErrorMessageElementForFields(
              checkoutData.termsAndConditionsSection[3].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.termsAndConditionsSection[3].emptyFieldMessage as string
      );

      // Select TCCC option from order purpose dropdown
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "TCCC"
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields required message are display or not in Department Information section
      checkoutData.departmentInformationSection.forEach(async (field) => {
        if (field.emptyFieldMessage) {
          expect(
            await page
              .locator(
                await checkoutpage.getErrorMessageElementForFields(
                  field.fieldName as string
                )
              )
              .textContent()
          ).toBe(field.emptyFieldMessage as string);
        }
      });

      // Select Third Party option from order purpose dropdown
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "Third-Party"
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields required message are display or not in Company Information section
      checkoutData.companyInformationSection.forEach(async (field) => {
        if (field.emptyFieldMessage) {
          expect(
            await page
              .locator(
                await checkoutpage.getErrorMessageElementForFields(
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
      // Enter invalid data  in approving manager email field
      await basePage.enterValuesInElement(
        checkoutpage.approvingManagerEmailField,
        checkoutData.approvalAndPurposeSection[1].invalidData as string
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify invalid email address message
      expect(
        await page
          .locator(
            await checkoutpage.getErrorMessageElementForFields(
              checkoutData.approvalAndPurposeSection[1].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.approvalAndPurposeSection[1].invalidDataMessage as string
      );

      // Select TCCC option from order purpose dropdown
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter invalid data in Finance Contact Email field
      await basePage.enterValuesInElement(
        checkoutpage.financeContactEmailField,
        checkoutData.departmentInformationSection[3].invalidData as string
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify invalid email address message
      expect(
        await page
          .locator(
            await checkoutpage.getErrorMessageElementForFields(
              checkoutData.departmentInformationSection[3].fieldName as string
            )
          )
          .textContent()
      ).toBe(
        checkoutData.departmentInformationSection[3]
          .invalidDataMessage as string
      );

      // Select Third Party option from order purpose dropdown
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "Third-Party"
      );

      // Enter invaid data in Account Payable Contact Email field
      await basePage.enterValuesInElement(
        checkoutpage.accountPayableContactEmailField,
        checkoutData.companyInformationSection[3].invalidData as string
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify invalid email address message
      expect(
        await page
          .locator(
            await checkoutpage.getErrorMessageElementForFields(
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
    if (addedPackageName != "") {
      // Enter data in Approval and Purpose section
      await checkoutpage.fillApprovalAndPurposeSection();

      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter data in Department Information section
      await checkoutpage.fillDepartmentInformationSection();

      // Select all checkbox in Terms and Conditions section
      await checkoutpage.fillTermsAndConditionsSectionOne();

      // Enter data in Terms and Condition section
      await checkoutpage.fillTermsAndConditionsSectionTwo();

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify Order success and Payment Intiated message are display or not
      expect(
        (await basePage.isElementVisible(
          checkoutpage.paymentInitiatedMessage
        )) &&
          (await basePage.isElementVisible(checkoutpage.orderSuccessMessage))
      ).toBe(true);

      // Verify directly navigate to My account page or not
      expect(await basePage.isElementVisible(checkoutpage.myAccountlabel)).toBe(
        true
      );
    }
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});