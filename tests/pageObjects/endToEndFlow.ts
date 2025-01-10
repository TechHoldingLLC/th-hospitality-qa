import { Page } from "@playwright/test";
import BasePage from "./basePage";
import { adminCreateEditPackagePage } from "./adminCreateEditPackage";
import path from "path";
let eventCreationWizard: adminEventCreationWizard;
let createEditPackagePage: adminCreateEditPackagePage;

export class endToEndFlow extends BasePage {
  constructor(page: Page) {
    super(page);
    eventCreationWizard = new eventCreationWizard(page);
    createEditPackagePage = new adminCreateEditPackagePage(page);
  }

  async createEventWithNewObjects(eventname: string) {
    //await this.addDataToEventInformationForm(eventname);
    await this.clickElement(eventCreationWizard.addProductButton);
    await createEditPackagePage.createProductUnderPackage(
      await this.generateNomenclatureName("Product_Under_Event")
    );
    await this.waitForElementHidden(eventCreationWizard.productNameInput);
    await this.clickElement(eventCreationWizard.nextButton);
    await this.clickElement(eventCreationWizard.addPackageButton);
    await eventCreationWizard.createPackageUnderEvent();
    await this.clickElement(eventCreationWizard.publishButton);
  }

  async addDataToEventInformationForm(eventname: string, programname: string) {
    await this.enterValuesInElement(
      eventCreationWizard.eventNameInput,
      eventname
    );

    // Generate start date & end date
    const startDate = await this.getRandomFutureDate();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5); // Add 5 days to the start date
    const endDateFormatted = `${String(endDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(endDate.getDate()).padStart(2, "0")}-${endDate.getFullYear()}`;

    await this.clickElement(eventCreationWizard.eventStartDateInput);
    await this.page.keyboard.type(startDate);
    await this.clickElement(eventCreationWizard.eventEndDateInput);
    await this.page.keyboard.type(endDateFormatted);

    await this.page.waitForTimeout(3000);
    await this.clickOnRandomOptionFromDropdown(
      eventCreationWizard.eventVenueDropdown
    );
    await this.page.waitForTimeout(3000);
    await eventCreationWizard.associatedProgramDropdown.selectOption(
      programname
    );

    await eventCreationWizard.thumbnailUploadInput.setInputFiles(
      path.join(
        __dirname,
        "../data/coca-cola-images/event/Coachella-2020-1280x720-988x416.jpg"
      )
    );
    await eventCreationWizard.mediaUploadInput.setInputFiles(
      path.join(__dirname, "../data/coca-cola-images/event/images.jpeg")
    );
    await this.clickElement(eventCreationWizard.nextButton);
  }
}
