import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminCreateEditProductPage extends BasePage {
  public productsButton: Locator;
  public addProductButton: Locator;
  public productNameInput: Locator;
  public productDescriptionInput: Locator;
  public productNameValidation: Locator;
  public productDescriptionValidation: Locator;
  public programValidation: Locator;
  public totalQuantityValidation: Locator;
  public giftIcon: Locator;
  public ticketIcon: Locator;
  public accommodationIcon: Locator;
  public airportTransferIcon: Locator;
  public parkingIcon: Locator;
  public otherIcon: Locator;
  public associatedProgramButton: Locator;
  public associateProgramList: Locator;
  public totalQuantityAvailable: Locator;
  public saveButton: Locator;
  public associatedEventButton: Locator;
  public associatedEventList: Locator;
  public roomTypeRadioGroup: Locator;
  public dateInput: Locator;
  public editProduct: Locator;

  constructor(page: Page) {
    super(page);
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
    this.ticketIcon = page.locator("//button[@data-test-id='ticket_icon']");
    this.accommodationIcon = page.locator(
      "//button[@data-test-id='accommodation_icon']"
    );
    this.airportTransferIcon = page.locator(
      "//button[@data-test-id='airport_transfer_icon']"
    );
    this.parkingIcon = page.locator("//button[@data-test-id='parking_icon']");
    this.otherIcon = page.locator("//button[@data-test-id='other_icon']");

    this.associatedProgramButton = page.locator(
      "//label[text()='Associated Program']/following-sibling::button"
    );
    this.associateProgramList = page.locator(
      "//div[@data-test-id='create-product__associated-programs']"
    );
    this.totalQuantityAvailable = page.locator(
      "//input[@name='additional_data.total_available']"
    );
    this.saveButton = page.locator("//button[text()='Save']");
    this.associatedEventButton = page.locator(
      "//label[text()='Associated Event']/following-sibling::button"
    );
    this.associatedEventList = page.locator(
      "//div[@data-test-id='create-product__associated-events']"
    );
    this.roomTypeRadioGroup = page.locator("//div[@role='radiogroup']//button");
    this.dateInput = page.locator(
      "//input[@name='additional_data.date_range']"
    );
    this.editProduct = page.locator("//span[text()='Edit']");
  }

  async createProductWithGift(): Promise<string> {
    const productName = await this.generateNomenclatureName("Product");
    await this.waitForElementVisible(this.productNameInput);
    await this.enterValuesInElement(this.productNameInput, productName);
    await this.enterValuesInElement(
      this.productDescriptionInput,
      await this.generateNomenclatureDescription("Product")
    );
    await this.clickElement(this.giftIcon);
    await this.clickElement(this.associatedProgramButton);
    await this.selectRandomItemFromMultiSelectList(this.associateProgramList);
    await this.enterValuesInElement(
      this.totalQuantityAvailable,
      await this.generate4RandomDigits()
    );
    await this.clickElement(this.saveButton);
    return productName;
  }

  async createProductWithTicket(): Promise<string> {
    const productName = await this.generateNomenclatureName("Product");
    await this.waitForElementVisible(this.productNameInput);
    await this.enterValuesInElement(this.productNameInput, productName);
    await this.enterValuesInElement(
      this.productDescriptionInput,
      await this.generateNomenclatureDescription("Product")
    );
    await this.clickElement(this.ticketIcon);

    await this.enterValuesInElement(
      this.totalQuantityAvailable,
      await this.generate4RandomDigits()
    );

    let programHasEvent = false;
    while (!programHasEvent) {
      // Select a random program
      await this.clickElement(this.associatedProgramButton);
      await this.page.waitForTimeout(2000);
      await this.selectRandomItemFromMultiSelectList(this.associateProgramList);

      // Check if the associated event button is enabled
      if (await this.associatedEventButton.isEnabled()) {
        programHasEvent = true;

        // Select a random event
        await this.clickElement(this.associatedEventButton);
        await this.page.waitForTimeout(2000);
        await this.selectRandomItemFromMultiSelectList(
          this.associatedEventList
        );
      }
    }
    await this.page.waitForTimeout(2000);
    await this.clickElement(this.saveButton);
    return productName;
  }

  async createProductWithAccommodation(): Promise<string> {
    const productName = await this.generateNomenclatureName("Product");
    await this.waitForElementVisible(this.productNameInput);
    await this.enterValuesInElement(this.productNameInput, productName);
    await this.enterValuesInElement(
      this.productDescriptionInput,
      await this.generateNomenclatureDescription("Product")
    );
    await this.clickElement(this.accommodationIcon);
    await this.clickElement(this.associatedProgramButton);
    await this.selectRandomItemFromMultiSelectList(this.associateProgramList);
    await this.enterValuesInElement(
      this.totalQuantityAvailable,
      await this.generate4RandomDigits()
    );
    await this.selectRandomRadioOption(this.roomTypeRadioGroup);
    await this.enterValuesInElement(
      this.dateInput,
      await this.getRandomFutureDate()
    );
    await this.clickElement(this.saveButton);
    return productName;
  }

  async createProductWithAirportTransfer(): Promise<string> {
    const productName = await this.generateNomenclatureName("Product");
    await this.waitForElementVisible(this.productNameInput);
    await this.enterValuesInElement(this.productNameInput, productName);
    await this.enterValuesInElement(
      this.productDescriptionInput,
      await this.generateNomenclatureDescription("Product")
    );
    await this.clickElement(this.airportTransferIcon);
    await this.clickElement(this.associatedProgramButton);
    await this.selectRandomItemFromMultiSelectList(this.associateProgramList);
    await this.enterValuesInElement(
      this.totalQuantityAvailable,
      await this.generate4RandomDigits()
    );
    await this.clickElement(this.saveButton);
    return productName;
  }

  async createProductWithParking(): Promise<string> {
    const productName = await this.generateNomenclatureName("Product");
    await this.waitForElementVisible(this.productNameInput);
    await this.enterValuesInElement(this.productNameInput, productName);
    await this.enterValuesInElement(
      this.productDescriptionInput,
      await this.generateNomenclatureDescription("Product")
    );
    await this.clickElement(this.parkingIcon);
    await this.clickElement(this.associatedProgramButton);
    await this.selectRandomItemFromMultiSelectList(this.associateProgramList);
    await this.enterValuesInElement(
      this.totalQuantityAvailable,
      await this.generate4RandomDigits()
    );
    await this.clickElement(this.saveButton);
    return productName;
  }

  async createProductWithOther(): Promise<string> {
    const productName = await this.generateNomenclatureName("Product");
    await this.waitForElementVisible(this.productNameInput);
    await this.enterValuesInElement(this.productNameInput, productName);
    await this.enterValuesInElement(
      this.productDescriptionInput,
      await this.generateNomenclatureDescription("Product")
    );
    await this.clickElement(this.otherIcon);
    await this.clickElement(this.associatedProgramButton);
    await this.selectRandomItemFromMultiSelectList(this.associateProgramList);
    await this.enterValuesInElement(
      this.totalQuantityAvailable,
      await this.generate4RandomDigits()
    );
    await this.clickElement(this.saveButton);
    return productName;
  }

  async getProductCreatedLocator(productName: string) {
    return `//span[text()='Product ${productName} was created successfully']`;
  }

  async getProductEditedLocator(productName: string) {
    return `//span[text()='Product ${productName} was successfully updated.']`;
  }

  async getCreatedProductKebabIcon(productName: string) {
    return `//span[text()='${productName}']/ancestor::td/following-sibling::td[7]`;
  }
}
