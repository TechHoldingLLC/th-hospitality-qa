import { Locator, Page } from "@playwright/test";

export class adminCreateEditProductPage {
  private page: Page;
  public productsButton: Locator;
  public addProductButton: Locator;
  public productNameInput: Locator;
  public productDescriptionInput: Locator;
  public productNameValidation: Locator;
  public productDescriptionValidation: Locator;
  public programValidation: Locator;
  public totalQuantityValidation: Locator;
  public giftIcon: Locator;
  public associatedProgramButton: Locator;
  public associateProgramList: Locator;
  public totalQuantityAvailable: Locator;
  public saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsButton = page.locator("//a[@href='/products']");
    this.addProductButton = page.locator("//a[@href='/products/create']");
    this.productNameInput = page.locator("//input[@name='title']");
    this.productDescriptionInput = page.locator(
      "//div[@data-placeholder ='Enter product Description']"
    );
    this.productNameValidation = page.locator(
      "//span[text()='Product name cannot be empty']"
    );
    this.productDescriptionValidation = page.locator(
      "//span[text()='Description cannot be empty']"
    );
    this.programValidation = page.locator(
      "//span[text()='Please select program']"
    );
    this.totalQuantityValidation = page.locator(
      "//span[text()='Please fill total quantity']"
    );
    this.giftIcon = page.locator("//button[@data-test-id='gift_icon']");
    this.associatedProgramButton = page.locator(
      "//span[text()='Select associated program']"
    );
    this.associateProgramList = page.locator(
      "//div[role='presentation']//div"
    );
    this.totalQuantityAvailable = page.locator(
      "//input[@name='additional_data.total_available']"
    );
    this.saveButton = page.locator("//button[text()='Save']");
  }
}
