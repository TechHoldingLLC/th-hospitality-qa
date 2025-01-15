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
      // Enter name in approving manager name field
      await basePage.enterValuesInElement(
        checkoutpage.approvingManagerNameField,
        checkoutData.approvalAndPurposeSection[0].inputData as string
      );

      // Enter email in approving manager email field
      await basePage.enterValuesInElement(
        checkoutpage.approvingManagerEmailField,
        checkoutData.approvalAndPurposeSection[1].inputData as string
      );

      // Enter data in Intended business use of Requested Packages field
      await basePage.enterValuesInElement(
        checkoutpage.requestedPackagesField,
        checkoutData.approvalAndPurposeSection[2].inputData as string
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

test("TC0132 - Verify that that Section 2a is displayed and functions correctly for the Third-Party order purpose.", async () => {
  try {
    if (addedPackageName != "") {
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "TCCC"
      );

      // Enter number in Cost Centre Number field
      await basePage.enterValuesInElement(
        checkoutpage.costCentreNumberField,
        checkoutData.departmentInformationSection[0].inputData as string
      );

      // Select random option from GL Account Number dropdown
      await basePage.clickOnRandomOptionFromDropdown(
        checkoutpage.glAccountNumberDropdown
      );

      // Enter name in Finance Contact Name field
      await basePage.enterValuesInElement(
        checkoutpage.financeContactNameField,
        checkoutData.departmentInformationSection[2].inputData as string
      );

      // Enter email in Finance Contact Email field
      await basePage.enterValuesInElement(
        checkoutpage.financeContactEmailField,
        checkoutData.departmentInformationSection[3].inputData as string
      );

      // Enter email in Finance Contact Email field
      await basePage.enterValuesInElement(
        checkoutpage.ioWBSElementField,
        checkoutData.departmentInformationSection[4].inputData as string
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      checkoutData.departmentInformationSection.forEach(async (field) => {
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

test("TC0133 - Verify that that Section 2b is displayed and functions correctly for the 'TCCC' order purpose.", async () => {
  try {
    if (addedPackageName != "") {
      await basePage.selectOptionFromDropdown(
        checkoutpage.orderPurposeDropdown,
        "Third-Party"
      );

      // Enter name in Company Name field
      await basePage.enterValuesInElement(
        checkoutpage.companyNameField,
        checkoutData.companyInformationSection[0].inputData as string
      );

      // Enter name in Company Name field
      await basePage.enterValuesInElement(
        checkoutpage.companyNameField,
        checkoutData.companyInformationSection[0].inputData as string
      );

      // Enter address in Company Mailing Address field
      await basePage.enterValuesInElement(
        checkoutpage.companyMailingAddressField,
        checkoutData.companyInformationSection[1].inputData as string
      );

      // Enter number in Purchase Order(PO) Number field
      await basePage.enterValuesInElement(
        checkoutpage.purchaseOrderNumberField,
        checkoutData.companyInformationSection[2].inputData as string
      );

      // Enter email in Account Payable Contact Email field
      await basePage.enterValuesInElement(
        checkoutpage.accountPayableContactEmailField,
        checkoutData.companyInformationSection[3].inputData as string
      );

      // Enter name in Account Payable Contact Name field
      await basePage.enterValuesInElement(
        checkoutpage.accountPayableContactNameField,
        checkoutData.companyInformationSection[4].inputData as string
      );

      // Enter number in Account Payable Telephone Number field
      await basePage.enterValuesInElement(
        checkoutpage.accountPayableTelephoneField,
        checkoutData.companyInformationSection[5].inputData as string
      );

      // Enter number in Tax Registration or VAT Number field
      await basePage.enterValuesInElement(
        checkoutpage.taxRegistrationorVATNameField,
        checkoutData.companyInformationSection[6].inputData as string
      );

      // Click on submit button
      await basePage.clickElement(checkoutpage.submitButton);

      // Verify fields are required message not display
      checkoutData.companyInformationSection.forEach(async (field) => {
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

test("TC0134 - Verify that that the terms and conditions section is displayed and functional.", async () => {
  try {
    if (addedPackageName != "") {
      // Click on Ethics Compliance checkbox
      await basePage.clickElement(checkoutpage.ethicsComplianceCheckBox);

      // Click on Finacial Commitment checkbox
      await basePage.clickElement(checkoutpage.financialCommitmentCheckbox);

      // Click on Manager Approval checkbox
      await basePage.clickElement(checkoutpage.managerApprovalCheckbox);

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

      // Verify fields are required message not display
      expect(
        await page
          .locator(
            await checkoutpage.getErrorMessageElementForFields(
              checkoutData.termsAndConditionsSection[3].fieldName as string
            )
          )
          .isVisible()
      ).toBe(true);

      // Select random option from Legal Entity dropdown
      await basePage.clickOnRandomOptionFromDropdown(
        checkoutpage.legalEntityDropdown
      );

      // Enter text in Additional Notes field
      await basePage.enterValuesInElement(
        checkoutpage.additionalNotesField,
        checkoutData.termsAndConditionsSection[4].inputData as string
      );

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
