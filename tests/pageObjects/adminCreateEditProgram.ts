import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { adminViewProgramsPage } from "./adminViewPrograms";
let viewProgramsPage: adminViewProgramsPage;

export class adminCreateEditProgramPage extends BasePage {
  public programNameLabel: Locator;
  public departmentLabel: Locator;
  public groupsLabel: Locator;
  public programNameInput: Locator;
  public departmentDropdown: Locator;
  public groupsDropdown: Locator;
  public groupsDropdownList: Locator;
  public cancelButton: Locator;
  public saveButton: Locator;
  public createSuccessMessage: Locator;
  public firstProgramName: Locator;
  public uniqueProgramNameErrorMessage: Locator;
  public editProgramSuccessMesaage: Locator;
  public departmentValue: Locator;
  public closeIconOnAddProgram: Locator;
  public confirmCloseAddProgram: Locator;
  public slugInput: Locator;
  public slugMinLengthValidation: Locator;
  public slugMaxLengthValidation: Locator;
  public programNameList: Locator;
  public actionButton: Locator;
  public editButton: Locator;
  public slugUniqueValidation: Locator;
  public templateTypeButton: Locator;
  public eventTypeDropdownList: Locator;

  // List of expected dropdown options
  expectedOptions = ["Single Event", "Multiple Event"];

  constructor(page: Page) {
    super(page);
    viewProgramsPage = new adminViewProgramsPage(page);
    this.programNameLabel = page.locator("//label[text()='Program Name']");
    this.departmentLabel = page.locator("//label[text()='Department']");
    this.groupsLabel = page.locator("//label[text()='Groups']");
    this.programNameInput = page.locator(
      "//label[text()='Program Name']/following-sibling::div//input[@name='name']"
    );
    this.departmentDropdown = page.locator("//select[@name='department']");
    this.groupsDropdown = page.locator("//div[@class='relative']//button");
    this.groupsDropdownList = page.locator(
      "//div[@class='absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto']//div"
    );
    this.cancelButton = page.locator("//button[text()='Cancel']");
    this.saveButton = page.locator("//button[text()='Save']");
    this.createSuccessMessage = page.locator(
      "//span[text()='Program has been created successfully']"
    );
    this.firstProgramName = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr[1]//td[1]//span"
    );
    this.uniqueProgramNameErrorMessage = page.locator(
      "//span[text()='The program name must be unique.']"
    );
    this.editProgramSuccessMesaage = page.locator(
      "//span[text()='Program has been updated successfully']"
    );
    this.departmentValue = page.locator(
      "//p[text()='Department']/following-sibling::p"
    );
    this.closeIconOnAddProgram = page.locator(
      "//div[@role='dialog']//div[@class='flex items-center gap-x-2']//button"
    );
    this.confirmCloseAddProgram = page.locator("//button[text()='Continue']");
    this.slugInput = page.locator("//input[@name='slug']");
    this.slugMinLengthValidation = page.locator(
      "//span[text()='Slug must be at least 4 characters long.']"
    );
    this.slugMaxLengthValidation = page.locator(
      "//span[text()='Slug cannot exceed 12 characters.']"
    );
    this.programNameList = page.locator(
      "//table[@class='text-ui-fg-subtle txt-compact-small relative w-full']//td[1]"
    );
    this.actionButton = page.locator(
      "//div[@class='flex justify-between gap-x-6 items-center']//button"
    );
    this.editButton = page.locator("//span[text()='Edit']");
    this.slugUniqueValidation = page.locator(
      "//span[text()='The program slug must be unique.']"
    );
    this.templateTypeButton = page.locator(
      "//label[text()='Template type']/following-sibling::button"
    );
    this.eventTypeDropdownList = page.locator(
      "//select[@name='template_type']"
    );
  }

  async createProgram(programName: string): Promise<void> {
    await this.programNameInput.fill(programName);
    // Select the random option by its value
    await this.clickOnRandomOptionFromDropdown(this.departmentDropdown);
    await this.groupsDropdown.click();
    //Select random item from list
    await this.selectRandomItemFromMultiSelectList(this.groupsDropdownList);
    await this.saveButton.click();
  }

  async getExistingSlug(): Promise<string> {
    await this.selectRandomItemFromMultiSelectList(this.programNameList);
    await this.clickElement(this.actionButton);
    await this.clickElement(this.editButton);
    const existingSlug = await this.slugInput.inputValue();
    await this.page.mouse.click(10, 10);
    await this.clickElement(viewProgramsPage.programsButton.first());
    return existingSlug;
  }

  async openEditFormForExistingProgram(): Promise<void> {
    await this.selectRandomItemFromMultiSelectList(this.programNameList);
    await this.clickElement(this.actionButton);
    await this.clickElement(this.editButton);
  }

  async getDropdownOptions() {
    const dropdown = this.eventTypeDropdownList;
    return await dropdown.locator("option").allTextContents();
  }
}
