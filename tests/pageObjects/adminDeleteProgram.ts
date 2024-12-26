import {expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteProgramPage extends BasePage {

    public deleteButton:Locator;
    public alertDialog:Locator;
    public deleteMessageLabel:Locator;
    public deleteProgramButton:Locator;
    public conformationButton:Locator;
    public searchInput:Locator;
    public noResultsLabel:Locator;

    constructor(page:Page){
        super(page);

        this.deleteButton = page.locator("//*[@role='menuitem']//span[text()='Delete']");
        this.alertDialog = page.locator("//div[@role='alertdialog']");
        this.deleteMessageLabel = page.locator("//p[contains(@class,'text-ui-fg-subtle')]/label[1]");
        this.deleteProgramButton = page.locator("//button[text()='Delete']");
        this.conformationButton  = page.locator("//button[text()='Yeah, Thanks!']");
        this.searchInput =page.locator("//input[@type='search']");
        this.noResultsLabel = page.locator("text='No results'");
    }

    // Delete program 
    async deleteProgram(programName:string){

        // Click on three dot button
        await this.page.locator('//div[normalize-space()="'+programName+'"]/ancestor::td/following-sibling::td//button').click();

        // Click on delete button
        await this.deleteButton.click();

        // Verify alert dialog open or not and verify alert message also
        expect(await this.isElementVisible(this.alertDialog)).toBe(true);
        expect(await this.deleteMessageLabel.textContent()).toBe('This will permanently delete the program "'+programName+'" and cannot be undone.');

        // Click on delete program button
        await this.deleteProgramButton.click();

        // Verify delete success message
        await this.isElementVisible(this.conformationButton);
        expect(await this.deleteMessageLabel.textContent()).toBe(programName+' was successfully deleted.');

        // click on conformation button
        await this.conformationButton.click();

        // verify popup close or not
        expect(await this.alertDialog.isHidden()).toBe(false);
    }

    // search program name and no results should be display
    async searchDeletedProgram(programName:string){

        // enter program name in search input
        await this.clickElement(this.searchInput);
        await this.enterValuesInElement(this.searchInput,programName);

        // Verify no results should be display
        expect(await this.isElementVisible(this.noResultsLabel)).toBe(true);
    }
}
