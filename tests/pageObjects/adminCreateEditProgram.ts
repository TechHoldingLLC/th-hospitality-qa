import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminCreateEditProgramPage extends BasePage {
  public programNameLabel: Locator;
  public departmentsLabel: Locator;
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
  public editProgramSuccessMessage: Locator;
  public closeIconOnAddProgram: Locator;
  public confirmCloseAddProgram: Locator;
  public slugInput: Locator;
  public departmentsButton: Locator;
  public nameOnDetailsPage: Locator;

  constructor(page: Page) {
    super(page);
    this.programNameLabel = page.locator("//label[text()='Program Name']");
    this.departmentsLabel = page.locator("//label[text()='Departments']");
    this.groupsLabel = page.locator("//label[text()='Groups']");
    this.programNameInput = page.locator(
      "//label[text()='Program Name']/following-sibling::div//input[@name='name']"
    );
    this.departmentDropdown = page.locator(
      "//div[@class='absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto']"
    );
    this.groupsDropdown = page.locator(
      "//label[text()='Groups']/following-sibling::div/button"
    );
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
    this.editProgramSuccessMessage = page.locator(
      "//span[text()='Program has been edited successfully']"
    );
    this.closeIconOnAddProgram = page.locator(
      "//div[@role='dialog']//div[@class='flex items-center gap-x-2']//button"
    );
    this.confirmCloseAddProgram = page.locator("//button[text()='Continue']");
    this.slugInput = page.locator("//input[@name='slug']");
    this.departmentsButton = page.locator(
      "//label[text()='Departments']/following-sibling::div/button"
    );
    this.nameOnDetailsPage = page.locator(
      "//p[@class='font-sans txt-large font-medium mr-2']"
    );
  }

  async createProgram(programName: string): Promise<void> {
    await this.programNameInput.fill(programName);
    await this.enterValuesInElement(
      this.slugInput,
      await this.generateRandomString()
    );
    // Select the random option by its value
    await this.clickElement(this.departmentsButton);
    await this.selectRandomItemFromMultiSelectList(this.departmentDropdown);
    await this.clickElement(this.programNameLabel);
    await this.groupsDropdown.click();
    //Select random item from list
    await this.selectRandomItemFromMultiSelectList(this.groupsDropdownList);
    await this.saveButton.click();
  }
}
