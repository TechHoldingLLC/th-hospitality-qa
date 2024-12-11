import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

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

    constructor(page: Page) {
        super(page);
        this.programNameLabel = page.locator("//label[text()='Program Name']");
        this.departmentLabel = page.locator("//label[text()='Department']");
        this.groupsLabel = page.locator("//label[text()='Groups']");
        this.programNameInput = page.locator("//input[@name='name']");
        this.departmentDropdown = page.locator("//select[@name='department']");
        this.groupsDropdown = page.locator("//div[@class='relative']//button");
        this.groupsDropdownList = page.locator("//div[@class='absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto']//div");
        this.cancelButton = page.locator("//button[text()='Cancel']");
        this.saveButton = page.locator("//button[text()='Save']");
        this.createSuccessMessage = page.locator("//span[text()='Program have been created successfully']");
        this.firstProgramName = page.locator("//tbody[@class='border-ui-border-base border-b-0']//tr[1]//td[1]//span");
        this.uniqueProgramNameErrorMessage = page.locator("//span[text()='The program name must be unique.']");
        this.editProgramSuccessMesaage = page.locator("//span[text()='Program have been updated successfully']");
        this.departmentValue = page.locator("//p[text()='Department']/following-sibling::p");
        this.closeIconOnAddProgram = page.locator("//div[@role='dialog']//div[@class='flex items-center gap-x-2']//button");
        this.confirmCloseAddProgram = page.locator("//button[text()='Continue']");
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
}