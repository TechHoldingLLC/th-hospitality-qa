import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import path from "path";

export class adminCreateEditPackagePage extends BasePage {
  public packagesButton: Locator;
  public addPackageButton: Locator;
  public packageNameInput: Locator;
  public associatedProgramDropdown: Locator;
  public packageDescriptionInput: Locator;
  public noOfGuestsDropdown: Locator;
  public departmentDropdown: Locator;
  public groupRestrictionsButton: Locator;
  public groupRestrictionsList: Locator;
  public totalQuantityAvailableInput: Locator;
  public maxQuantityPerOrderInput: Locator;
  public currencyAndPrice: Locator;
  public thumbnailUpload: Locator;
  public mediaUpload: Locator;
  public nextButton: Locator;
  public productsTab: Locator;
  public packageNameValidation: Locator;
  public associatedProgramValidation: Locator;
  public packageDescriptionValidation: Locator;
  public maxQuantityPerOrderValidation: Locator;
  public thumbnailValidation: Locator;
  public mediaValidation: Locator;

  constructor(page: Page) {
    super(page);
    this.packagesButton = page.locator("//a[@href='/packages']");
    this.addPackageButton = page.locator("//a[@href='/packages/create']");
    this.packageNameInput = page.locator("//input[@name='name']");
    this.associatedProgramDropdown = page.locator("//select[@name='program']");
    this.packageDescriptionInput = page.locator(
      "//div[@data-placeholder='Enter package Description']"
    );
    this.noOfGuestsDropdown = page.locator("//select[@name='total_guests']");
    this.departmentDropdown = page.locator("//select[@name='department']");
    this.groupRestrictionsButton = page.locator(
      "//div[@class='relative']//button"
    );
    this.groupRestrictionsList = page.locator(
      "//div[@class='flex items-center p-2 cursor-pointer hover:bg-backgrounds/bg-subtle multiSelectLabel']"
    );
    this.totalQuantityAvailableInput = page.locator(
      "//input[@name='total_quantity']"
    );
    this.maxQuantityPerOrderInput = page.locator(
      "//input[@name='max_quantity_per_person']"
    );
    this.currencyAndPrice = page.locator("//input[@inputmode='decimal']");
    this.thumbnailUpload = page.locator(
      "//h1[text()='Thumbnail ']/following-sibling::div[@id='media']/descendant::input"
    );
    this.mediaUpload = page.locator(
      "//h1[text()='Media ']/following-sibling::div[@id='media']/descendant::input"
    );
    this.nextButton = page.locator(
      "//div[@class='border-ui-border-base flex items-center justify-end space-x-2 overflow-y-auto border-t px-6 py-4']//button[text()='Next']"
    );
    this.productsTab = page.locator(
      "//div[@role='tablist']//button[text()='Products']"
    );
    this.packageNameValidation = page.locator(
      "//span[text()='Package Name must not be empty.']"
    );
    this.associatedProgramValidation = page.locator(
      "//span[text()='Program is required.']"
    );
    this.packageDescriptionValidation = page.locator(
      "//span[text()='Package Description is required.']"
    );
    this.maxQuantityPerOrderValidation = page.locator(
      "//span[text()='Max quantity per order must be less than total quantity.']"
    );
    this.thumbnailValidation = page.locator(
      "//span[text()='At least one thumbnail is required.']"
    );
    this.mediaValidation = page.locator(
      "//span[text()='At least one media is required.']"
    );
  }

  async addPackage(): Promise<void> {
    const packagename = await this.generateNomenclatureName("Package");
    const packageDescription = await this.generateNomenclatureDescription(
      "Package"
    );
    await this.waitForElementVisible(this.packageNameInput);
    await this.enterValuesInElement(this.packageNameInput, packagename);
    await this.page.waitForTimeout(3000);
    await this.clickOnRandomOptionFromDropdown(this.associatedProgramDropdown);
    await this.enterValuesInElement(
      this.packageDescriptionInput,
      packageDescription
    );
    await this.clickOnRandomOptionFromDropdown(this.noOfGuestsDropdown);
    await this.clickOnRandomOptionFromDropdown(this.departmentDropdown);
    await this.clickElement(this.groupRestrictionsButton);
    await this.selectRandomItemFromMultiSelectList(this.groupRestrictionsList);
    await this.enterValuesInElement(this.totalQuantityAvailableInput, "10");
    await this.enterValuesInElement(this.maxQuantityPerOrderInput, "2");
    await this.enterValuesInElement(this.currencyAndPrice, "10");
    await this.thumbnailUpload.setInputFiles(
      path.join(__dirname, "../coca-cola-images/packages/event-img1.webp")
    );
    await this.mediaUpload.setInputFiles(
      path.join(__dirname, "../coca-cola-images/packages/event-img2.webp")
    );
    await this.clickElement(this.nextButton);
  }
}
