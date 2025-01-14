import { Browser, Locator, Page, expect } from "@playwright/test";
import BasePage from "./basePage";

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
  public submitButton: Locator;

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
  }

  async getErrorMessageElementForFields(elementName: string) {
    return `//label[text()='${elementName}']/following-sibling::span[contains(@class,'text-red')]`;
  }
}
