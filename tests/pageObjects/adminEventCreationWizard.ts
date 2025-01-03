import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import path from "path";

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

  constructor(page: Page) {
    super(page);
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
  }

  async createEvent(eventname: string) {
    await this.enterValuesInElement(this.eventNameInput, eventname);
    await this.page.waitForTimeout(2000);
    await this.thumbnailUploadInput.setInputFiles(
      path.join(__dirname, "../coca-cola-images/event/Coachella23-Banner.png")
    );
    await this.mediaUploadInput.setInputFiles(
      path.join(__dirname, "../coca-cola-images/event/images.jpeg")
    );
  }
}
