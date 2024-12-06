import { Locator, Page } from "@playwright/test";

export class adminCreateEditProgramPage {
    private page: Page;
    public programNameLabel: Locator;
    public departmentLabel: Locator;
    public groupsLabel: Locator;
    public programNameInput: Locator;
    public departmentDropdown: Locator;
    public groupsDropdown: Locator;
    public groupNameFranceOlympics: Locator;
    public groupNameMusic: Locator;
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
        this.page = page;
        this.programNameLabel = page.locator("//label[text()='Program Name']");
        this.departmentLabel = page.locator("//label[text()='Department']");
        this.groupsLabel = page.locator("//label[text()='Groups']");
        this.programNameInput = page.locator("//input[@name='name']");
        this.departmentDropdown = page.locator("//select[@name='department']");
        this.groupsDropdown = page.locator("//button[@class='bg-ui-bg-field shadow-buttons-neutral transition-fg flex w-full h-fit select-none items-center justify-between rounded-md outline-none data-[placeholder]:text-ui-fg-muted text-ui-fg-base hover:bg-ui-bg-field-hover focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error invalid:border-ui-border-error invalid:shadow-borders-error disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled group/trigger h-8 px-2 py-1.5 txt-compact-small']");
        this.groupNameFranceOlympics = page.locator("//div[@class='flex items-center p-2 cursor-pointer hover:bg-backgrounds/bg-subtle multiSelectLabel']//span[text()='France Olympics']");
        this.groupNameMusic = page.locator("//div[@class='flex items-center p-2 cursor-pointer hover:bg-backgrounds/bg-subtle multiSelectLabel']//span[text()='Music']");
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
}