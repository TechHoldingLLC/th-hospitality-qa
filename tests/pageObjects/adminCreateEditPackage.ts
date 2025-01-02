import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import path from "path";
import { adminViewProgramsPage } from "./adminViewPrograms";
let viewProgramsPage: adminViewProgramsPage;

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
  public currencyAndPriceInput: Locator;
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
  public productSearchInput: Locator;
  public selectProductButton: Locator;
  public selectProductDropdown: Locator;
  public submitButton: Locator;
  public addNewProductButton: Locator;
  public selectedProductText: Locator;
  public firstProgramText: Locator;
  public packageCreationSuccessMessage: Locator;
  public inPackageQuantityInput: Locator;
  public deleteProductIcon: Locator;

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
    this.currencyAndPriceInput = page.locator("//input[@inputmode='decimal']");
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
      "//span[text()='Required']"
    );
    this.thumbnailValidation = page.locator(
      "//span[text()='At least one thumbnail is required.']"
    );
    this.mediaValidation = page.locator(
      "//span[text()='At least one media is required.']"
    );
    this.productSearchInput = page.locator("//input[@name='products']");
    this.selectProductButton = page.locator("//div[@class='mt-2']//button");
    this.selectProductDropdown = page.locator("//div[@class='mt-2']/select");
    this.submitButton = page.locator("//button[text()='Submit']");
    this.addNewProductButton = page.locator(
      "//a[@href='/packages/create/product-create']"
    );
    this.selectedProductText = page.locator(
      "//span[@class='flex items-center gap-3 stroke-foregrounds/fg-base']"
    );
    this.firstProgramText = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr[1]//td[1]"
    );
    viewProgramsPage = new adminViewProgramsPage(page);
    this.packageCreationSuccessMessage = page.locator(
      "//span[text()='Package created successfully']"
    );
    this.inPackageQuantityInput = page.locator(
      "//input[@data-test-id='in-package-quantity']"
    );
    this.deleteProductIcon = page.locator(
      "//button[@data-test-id='no-of-packages']"
    );
  }

  async addPackage(): Promise<void> {
    const maxQuantity = await this.addPackageDetailsForm();
    await this.addPackageProductForm(maxQuantity);
    await this.clickElement(this.submitButton);
  }

  async addPackageDetailsForm(): Promise<string> {
    await this.clickElement(viewProgramsPage.programsButton);
    const programName = await this.getElementText(this.firstProgramText);
    await this.clickElement(this.packagesButton);
    await this.clickElement(this.addPackageButton);

    const packagename = await this.generateNomenclatureName("Package");
    const packageDescription = await this.generateNomenclatureDescription(
      "Package"
    );
    await this.waitForElementVisible(this.packageNameInput);
    await this.enterValuesInElement(this.packageNameInput, packagename);
    await this.page.waitForTimeout(2000);
    await this.clickOnRandomOptionFromDropdown(this.associatedProgramDropdown);
    await this.associatedProgramDropdown.selectOption(programName);
    await this.enterValuesInElement(
      this.packageDescriptionInput,
      packageDescription
    );
    await this.clickOnRandomOptionFromDropdown(this.noOfGuestsDropdown);
    await this.clickOnRandomOptionFromDropdown(this.departmentDropdown);
    await this.clickElement(this.groupRestrictionsButton);
    await this.selectRandomItemFromMultiSelectList(this.groupRestrictionsList);
    await this.clickElement(this.currencyAndPriceInput);
    const totalQuantity = await this.generate2RandomDigits();
    await this.enterValuesInElement(
      this.totalQuantityAvailableInput,
      totalQuantity
    );

    const maxQuantity = Math.floor(
      Math.random() * (parseInt(totalQuantity) - 10) + 10
    ).toString();
    await this.enterValuesInElement(this.maxQuantityPerOrderInput, maxQuantity);

    await this.enterValuesInElement(
      this.currencyAndPriceInput,
      await this.generate4RandomDigits()
    );
    await this.thumbnailUpload.setInputFiles(
      path.join(__dirname, "../coca-cola-images/packages/event-img1.webp")
    );
    await this.mediaUpload.setInputFiles(
      path.join(__dirname, "../coca-cola-images/packages/event-img2.webp")
    );
    await this.clickElement(this.nextButton);
    return maxQuantity;
  }

  async addPackageProductForm(maxQuantity: string) {
    await this.enterValuesInElement(this.productSearchInput, "a");
    await this.page.waitForTimeout(2000);
    await this.clickElement(this.selectProductButton);
    await this.page.waitForTimeout(2000);
    await this.clickOnRandomOptionFromDropdown(this.selectProductDropdown);
    await this.page.mouse.click(10, 10);

    const inPackageQuantity = Math.floor(
      Math.random() * (parseInt(maxQuantity) - 10) + 10
    ).toString();

    await this.enterValuesInElement(
      this.inPackageQuantityInput,
      inPackageQuantity
    );
  }
}
