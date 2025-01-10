import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import path from "path";
import { adminCreateEditPackagePage } from "./adminCreateEditPackage";
import { adminCreateEditProgramPage } from "./adminCreateEditProgram";

let createEditPackagePage: adminCreateEditPackagePage;
let createEditProgramPage: adminCreateEditProgramPage;

export class adminEventCreationWizardpage extends BasePage {
  public eventsButton: Locator;
  public addEventButton: Locator;
  public productsTab: Locator;
  public eventNameValidation: Locator;
  public eventStartDateValidation: Locator;
  public eventEndDateValidation: Locator;
  public eventVenueValidation: Locator;
  public associatedProgramValidation: Locator;
  public thumbnailValidation: Locator;
  public mediaValidation: Locator;
  public eventNameInput: Locator;
  public eventStartDateInput: Locator;
  public eventEndDateInput: Locator;
  public eventVenueDropdown: Locator;
  public associatedProgramDropdown: Locator;
  public thumbnailUploadInput: Locator;
  public mediaUploadInput: Locator;
  public nextButton: Locator;
  public productList: Locator;
  public eventTab: Locator;
  public packageList: Locator;
  public saveDraftButton: Locator;
  public publishButton: Locator;
  public packagesTab: Locator;
  public eventDraftSuccessMessage: Locator;
  public editButton: Locator;
  public eventDescriptionInput: Locator;
  public eventPublishSuccessMessage: Locator;
  public addProductButton: Locator;
  public addPackageButton: Locator;
  public productNameInput: Locator;
  public packageNameInput: Locator;
  public cancelButton: Locator;
  public cancelPopUpText: Locator;
  public confirmCancelButton: Locator;
  public addProgramButton: Locator;

  constructor(page: Page) {
    super(page);
    createEditPackagePage = new adminCreateEditPackagePage(page);
    createEditProgramPage = new adminCreateEditProgramPage(page);
    this.eventsButton = page.locator("//a[@href='/events']");
    this.addEventButton = page.locator("//a[@href='/events/create']");
    this.productsTab = page.locator("//button[text()='Products']");
    this.eventNameValidation = page.locator(
      "//span[text()='Event name must be provided.']"
    );
    this.eventStartDateValidation = page.locator(
      "//span[text()='Start date must be provided']"
    );
    this.eventEndDateValidation = page.locator(
      "//span[text()='End date must be provided']"
    );
    this.eventVenueValidation = page.locator(
      "//span[text()='Venue must be selected.']"
    );
    this.associatedProgramValidation = page.locator(
      "//span[text()='Program must be selected.']"
    );
    this.thumbnailValidation = page.locator(
      "//span[text()='At least one thumbnail is required.']"
    );
    this.mediaValidation = page.locator(
      "//span[text()='At least one media is required.']"
    );
    this.eventNameInput = page.locator("//input[@name='name']");
    this.eventStartDateInput = page.locator(
      "//label[text()='Event Start Date']/following-sibling::div"
    );
    this.eventEndDateInput = page.locator(
      "//label[text()='Event End Date']/following-sibling::div"
    );
    this.eventVenueDropdown = page.locator("//select[@name='venue_id']");
    this.associatedProgramDropdown = page.locator(
      "//select[@name='program_id']"
    );
    this.thumbnailUploadInput = page.locator("//div/descendant::input[3]");
    this.mediaUploadInput = page.locator(
      "//div[@class='mt-6']/descendant::input"
    );
    this.nextButton = page.locator("//button[text()='Next']").last();
    this.productList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr"
    );
    this.eventTab = page.locator("//button[text()='Event']");
    this.packageList = page.locator(
      "//div[@class='shadow-elevation-card-rest w-[252px] h-[307px] p-[10px] rounded-[12px] bg-[#F4F4F5] shadow-sm flex flex-col justify-between items-center']"
    );
    this.saveDraftButton = page.locator("//button[text()='Save Draft']");
    this.publishButton = page.locator("//button[text()='Publish']");
    this.packagesTab = page.locator("//button[text()='Packages']");
    this.eventDraftSuccessMessage = page.locator(
      "//span[text()='Event has been saved as draft successfully']"
    );
    this.editButton = page.locator("//span[text()='Edit']");
    this.eventDescriptionInput = page.locator(
      "//div[@class='ql-editor ql-blank']"
    );
    this.eventPublishSuccessMessage = page.locator(
      "//span[text()='Event has been published successfully']"
    );
    this.addProductButton = page.locator(
      "//a[@href='/events/create/product-create']"
    );
    this.addPackageButton = page.locator(
      "//a[@href='/events/create/package-create']"
    );
    this.productNameInput = page.locator("//input[@name='title']");
    this.packageNameInput = page.locator("//input[@name='name']");
    this.cancelButton = page.locator("//button[text()='Cancel']");
    this.cancelPopUpText = page.locator(
      "//div[@class='flex flex-col gap-y-1 px-6 pt-6']"
    );
    this.confirmCancelButton = page.locator("//button[text()='Continue']");
    this.addProgramButton = page.locator(
      "//a[@href='/events/create/program-create']"
    );
  }

  async createEvent(eventname: string) {
    await this.fillEventInformationForm(eventname);
    await this.checkItemListAndNavigate(
      this.productList,
      this.nextButton,
      this.productsTab
    );
    await this.checkItemListAndNavigate(
      this.packageList,
      this.saveDraftButton,
      this.packagesTab
    );
  }

  async fillEventInformationForm(eventname: string) {
    await this.enterValuesInElement(this.eventNameInput, eventname);

    // Generate start date & end date
    const startDate = await this.getRandomFutureDate();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5); // Add 5 days to the start date
    const endDateFormatted = `${String(endDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(endDate.getDate()).padStart(2, "0")}-${endDate.getFullYear()}`;

    await this.clickElement(this.eventStartDateInput);
    await this.page.keyboard.type(startDate);
    await this.clickElement(this.eventEndDateInput);
    await this.page.keyboard.type(endDateFormatted);

    await this.page.waitForTimeout(3000);
    await this.clickOnRandomOptionFromDropdown(this.eventVenueDropdown);
    await this.page.waitForTimeout(3000);
    await this.clickOnRandomOptionFromDropdown(this.associatedProgramDropdown);

    await this.thumbnailUploadInput.setInputFiles(
      path.join(
        __dirname,
        "../data/coca-cola-images/event/Coachella-2020-1280x720-988x416.jpg"
      )
    );
    await this.mediaUploadInput.setInputFiles(
      path.join(__dirname, "../data/coca-cola-images/event/images.jpeg")
    );
    await this.clickElement(this.nextButton);
  }

  async checkItemListAndNavigate(list: Locator, button: Locator, tab: Locator) {
    while (true) {
      await this.page.waitForTimeout(2000);
      // Check number of rows
      const count = await list.count();

      if (count > 0) {
        await this.clickElement(button);
        break;
      } else {
        await this.clickElement(this.eventTab);
        await this.clickOnRandomOptionFromDropdown(
          this.associatedProgramDropdown
        );
        await this.clickElement(tab);
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async createdEventKebabIconLocator(
    createdEventName: string
  ): Promise<Locator> {
    return this.page.locator(
      `//span[text()="${createdEventName}"]/ancestor::td/following-sibling::td[7]`
    );
  }

  async getStatusByEventName(createdEventName: string) {
    return this.page.locator(
      `//span[text()="${createdEventName}"]/ancestor::td/following-sibling::td[6]`
    );
  }

  async createEventWithNewObjects(eventname: string) {
    await this.fillEventInformationFormWithNewProgram(eventname);
    await this.clickElement(this.addProductButton);
    await createEditPackagePage.createProductUnderPackage(
      await this.generateNomenclatureName("Product_Under_Event")
    );
    await this.waitForElementHidden(this.productNameInput);
    await this.clickElement(this.nextButton);
    await this.clickElement(this.addPackageButton);
    await this.createPackageUnderEvent();
    await this.clickElement(this.publishButton);
  }

  async createPackageUnderEvent() {
    await this.waitForElementVisible(this.packageNameInput);
    await this.enterValuesInElement(
      this.packageNameInput,
      await this.generateNomenclatureName("Package_Under_Event")
    );
    await this.enterValuesInElement(
      createEditPackagePage.packageDescriptionInput,
      await this.generateNomenclatureDescription("Package_Under_Event")
    );
    await this.clickOnRandomOptionFromDropdown(
      createEditPackagePage.noOfGuestsDropdown
    );
    await this.clickOnRandomOptionFromDropdown(
      createEditPackagePage.departmentDropdown
    );
    await this.clickElement(createEditPackagePage.currencyAndPriceInput);
    const totalQuantity = await createEditPackagePage.generateTwoRandomDigits();
    await this.enterValuesInElement(
      createEditPackagePage.totalQuantityAvailableInput,
      totalQuantity
    );

    const maxQuantity = Math.floor(Math.random() * 9 + 1).toString();
    await this.enterValuesInElement(
      createEditPackagePage.maxQuantityPerOrderInput,
      maxQuantity
    );

    await this.enterValuesInElement(
      createEditPackagePage.currencyAndPriceInput,
      await this.generateFourRandomDigits()
    );
    await createEditPackagePage.thumbnailUpload.setInputFiles(
      path.join(__dirname, "../data/coca-cola-images/packages/event-img1.webp")
    );
    await createEditPackagePage.mediaUpload.setInputFiles(
      path.join(
        __dirname,
        "../data/coca-cola-images/packages/coachella-2025-lineup-696x398.jpg"
      )
    );
    await createEditPackagePage.clickElement(this.nextButton);
    await createEditPackagePage.addPackageProductForm();
    await this.clickElement(createEditPackagePage.submitButton);
  }

  async fillEventInformationFormWithNewProgram(eventname: string) {
    await this.enterValuesInElement(this.eventNameInput, eventname);

    // Generate start date & end date
    const startDate = await this.getRandomFutureDate();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5); // Add 5 days to the start date
    const endDateFormatted = `${String(endDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(endDate.getDate()).padStart(2, "0")}-${endDate.getFullYear()}`;

    await this.clickElement(this.eventStartDateInput);
    await this.page.keyboard.type(startDate);
    await this.clickElement(this.eventEndDateInput);
    await this.page.keyboard.type(endDateFormatted);

    await this.page.waitForTimeout(3000);
    await this.clickOnRandomOptionFromDropdown(this.eventVenueDropdown);

    // Create new program and link to event
    await this.clickElement(this.addProgramButton);
    const programName = await this.generateNomenclatureName(
      "Program_Under_Event"
    );
    await createEditProgramPage.createProgram(programName);
    await this.waitForElementToAppearAndDisappear(
      createEditProgramPage.createSuccessMessage
    );
    await this.associatedProgramDropdown.selectOption(programName);

    await this.thumbnailUploadInput.setInputFiles(
      path.join(
        __dirname,
        "../data/coca-cola-images/event/Coachella-2020-1280x720-988x416.jpg"
      )
    );
    await this.mediaUploadInput.setInputFiles(
      path.join(__dirname, "../data/coca-cola-images/event/images.jpeg")
    );
    await this.clickElement(this.nextButton);
  }
}
