import { Browser, Locator, Page, expect } from "@playwright/test";
import BasePage from "./basePage";
import checkoutData from "../data/checkoutData.json";

export class shopCheckoutPage extends BasePage {
  public approvingManagerNameField: Locator;
  public approvingManagerEmailField: Locator;
  public requestedPackagesField: Locator;
  public intendedInviteeCategoryDropdown: Locator;
  public orderPurposeDropdown: Locator;
  public costCentreNumberField: Locator;
  public glAccountNumberDropdown: Locator;
  public financeContactNameField: Locator;
  public financeContactEmailField: Locator;
  public ioWBSElementField: Locator;
  public companyNameField: Locator;
  public companyMailingAddressField: Locator;
  public purchaseOrderNumberField: Locator;
  public accountPayableContactEmailField: Locator;
  public accountPayableContactNameField: Locator;
  public accountPayableTelephoneField: Locator;
  public taxRegistrationorVATNameField: Locator;
  public ethicsComplianceCheckBox: Locator;
  public financialCommitmentCheckbox: Locator;
  public managerApprovalCheckbox: Locator;
  public legalEntityDropdown: Locator;
  public additionalNotesField: Locator;
  public submitButton: Locator;
  public orderSuccessMessage: Locator;
  public paymentInitiatedMessage: Locator;
  public myAccountLink: Locator;
  public myAccountLabel: Locator;
  public ordersButton: Locator;
  public orderID: Locator;

  constructor(page: Page) {
    super(page);

    this.approvingManagerNameField = page.locator(
      "//input[@name='approving_manager_name']"
    );
    this.approvingManagerEmailField = page.locator(
      "//input[@name='approving_manager_email']"
    );
    this.requestedPackagesField = page.locator(
      "//input[@name='intended_business_use']"
    );
    this.intendedInviteeCategoryDropdown = page.locator(
      "//label[text()='Intended Invitee Category']/following-sibling::select"
    );
    this.orderPurposeDropdown = page.locator(
      "//label[text()='Order Purpose']/following-sibling::select"
    );
    this.submitButton = page.locator("//button[@aria-label='Submit Checkout']");
    this.costCentreNumberField = page.locator(
      "//input[@name='department_information.cost_centre_number']"
    );
    this.glAccountNumberDropdown = page.locator(
      "//label[text()='GL Account Number']/following-sibling::select"
    );
    this.financeContactNameField = page.locator(
      "//input[@name='department_information.finance_contact_name']"
    );
    this.financeContactEmailField = page.locator(
      "//input[@name='department_information.finance_email']"
    );
    this.ioWBSElementField = page.locator(
      "//input[@name='department_information.io_wbs']"
    );
    this.companyNameField = page.locator(
      "//input[@name='company_information.company_name']"
    );
    this.companyMailingAddressField = page.locator(
      "//input[@name='company_information.company_mail_address']"
    );
    this.purchaseOrderNumberField = page.locator(
      "//input[@name='company_information.po_number']"
    );
    this.accountPayableContactEmailField = page.locator(
      "//input[@name='company_information.account_payable_email']"
    );
    this.accountPayableContactNameField = page.locator(
      "//input[@name='company_information.account_payable_name']"
    );
    this.accountPayableTelephoneField = page.locator(
      "//input[@name='company_information.account_payable_contact_number']"
    );
    this.taxRegistrationorVATNameField = page.locator(
      "//input[@name='company_information.vat_number']"
    );
    this.ethicsComplianceCheckBox = page.locator(
      "//label[@for='ethics-compliance']/preceding-sibling::button"
    );
    this.financialCommitmentCheckbox = page.locator(
      "//label[@for='financial-commitment']/preceding-sibling::button"
    );
    this.managerApprovalCheckbox = page.locator(
      "//label[@for='manager-approval']/preceding-sibling::button"
    );
    this.legalEntityDropdown = page.locator(
      "//label[text()='Legal Entity']/following-sibling::select"
    );
    this.additionalNotesField = page.locator(
      "//textarea[@id='additional-notes']"
    );
    this.orderSuccessMessage = page.locator(
      "//span[text()='Order placed successfully!']"
    );
    this.paymentInitiatedMessage = page.locator(
      "//span[text()='Payment initiated successfully!']"
    );
    this.myAccountLink = page.locator("//a[text()='My Account']");
    this.myAccountLabel = page.locator("//h1[text()='My Account']");
    this.ordersButton = page.locator(
      "//button[contains(@aria-controls,'orders')]"
    );
    this.orderID = page.locator(
      "//label[text()='Order Id:']/following-sibling::p/span"
    );
  }

  async getErrorMessageElementForFields(elementName: string) {
    return `//label[text()='${elementName}']/following-sibling::span[contains(@class,'text-red')]`;
  }

  async getErrorMessageElementForCheckBoxFields(elementName: string) {
    return `//label[text()='${elementName}']/parent::div/following-sibling::div[contains(@class,'text-red')]`;
  }

  // Enter data in Approval and Purpose section
  async fillApprovalAndPurposeSection() {
    // Enter name in approving manager name field
    await this.enterValuesInElement(
      this.approvingManagerNameField,
      checkoutData.approvalAndPurposeSection[0].inputData as string
    );

    // Enter email in approving manager email field
    await this.enterValuesInElement(
      this.approvingManagerEmailField,
      checkoutData.approvalAndPurposeSection[1].inputData as string
    );

    // Enter data in Intended business use of Requested Packages field
    await this.enterValuesInElement(
      this.requestedPackagesField,
      checkoutData.approvalAndPurposeSection[2].inputData as string
    );

    // Select random option from Intended Invitee Category dropdown
    await this.clickOnRandomOptionFromDropdown(
      this.intendedInviteeCategoryDropdown
    );

    // Select option from Order Purpose dropdown
    await this.clickOnRandomOptionFromDropdown(this.orderPurposeDropdown);
  }

  // Enter data in Department Information section
  async fillDepartmentInformationSection() {
    // Enter number in Cost Centre Number field
    await this.enterValuesInElement(
      this.costCentreNumberField,
      checkoutData.departmentInformationSection[0].inputData as string
    );

    // Select random option from GL Account Number dropdown
    await this.clickOnRandomOptionFromDropdown(this.glAccountNumberDropdown);

    // Enter name in Finance Contact Name field
    await this.enterValuesInElement(
      this.financeContactNameField,
      checkoutData.departmentInformationSection[2].inputData as string
    );

    // Enter email in Finance Contact Email field
    await this.enterValuesInElement(
      this.financeContactEmailField,
      checkoutData.departmentInformationSection[3].inputData as string
    );

    // Enter email in Finance Contact Email field
    await this.enterValuesInElement(
      this.ioWBSElementField,
      checkoutData.departmentInformationSection[4].inputData as string
    );
  }

  // Enter data in Company Information section
  async fillCompanyInformationSection() {
    // Enter name in Company Name field
    await this.enterValuesInElement(
      this.companyNameField,
      checkoutData.companyInformationSection[0].inputData as string
    );

    // Enter name in Company Name field
    await this.enterValuesInElement(
      this.companyNameField,
      checkoutData.companyInformationSection[0].inputData as string
    );

    // Enter address in Company Mailing Address field
    await this.enterValuesInElement(
      this.companyMailingAddressField,
      checkoutData.companyInformationSection[1].inputData as string
    );

    // Enter number in Purchase Order(PO) Number field
    await this.enterValuesInElement(
      this.purchaseOrderNumberField,
      checkoutData.companyInformationSection[2].inputData as string
    );

    // Enter email in Account Payable Contact Email field
    await this.enterValuesInElement(
      this.accountPayableContactEmailField,
      checkoutData.companyInformationSection[3].inputData as string
    );

    // Enter name in Account Payable Contact Name field
    await this.enterValuesInElement(
      this.accountPayableContactNameField,
      checkoutData.companyInformationSection[4].inputData as string
    );

    // Enter number in Account Payable Telephone Number field
    await this.enterValuesInElement(
      this.accountPayableTelephoneField,
      checkoutData.companyInformationSection[5].inputData as string
    );

    // Enter number in Tax Registration or VAT Number field
    await this.enterValuesInElement(
      this.taxRegistrationorVATNameField,
      checkoutData.companyInformationSection[6].inputData as string
    );
  }

  // Select all checkbox in Terms and Conditions section
  async fillTermsAndConditionsSectionOne() {
    // Click on Ethics Compliance checkbox
    await this.clickElement(this.ethicsComplianceCheckBox);

    // Click on Finacial Commitment checkbox
    await this.clickElement(this.financialCommitmentCheckbox);

    // Click on Manager Approval checkbox
    await this.clickElement(this.managerApprovalCheckbox);
  }

  // Enter data in Terms and Conditions section
  async fillTermsAndConditionsSectionTwo() {
    // Select random option from Legal Entity dropdown
    await this.clickOnRandomOptionFromDropdown(this.legalEntityDropdown);

    // Enter text in Additional Notes field
    await this.enterValuesInElement(
      this.additionalNotesField,
      checkoutData.termsAndConditionsSection[4].inputData as string
    );
  }

  // Navigate to Order page from My Account
  async navigatetoOrderpage() {
    // Click on my account
    await this.clickElement(this.myAccountLink);

    await this.waitForPageToBeReady();
    await this.page.waitForTimeout(2000);

    await this.clickElement(this.ordersButton);

    await this.waitForPageToBeReady();
    await this.page.waitForTimeout(2000);
  }

  // Get Order ID list from My Account page
  async getOrderIDList(): Promise<string[]> {
    await this.isElementVisible(this.orderID.first());

    // Get the count of list items
    const count = await this.orderID.count();

    const orderIDData: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.orderID.nth(i).innerText();
      orderIDData.push(text);
    }

    return orderIDData;
  }
}
