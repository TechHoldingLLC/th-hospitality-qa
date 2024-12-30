import { expect,Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeletePackagesPage extends BasePage{

    public threeDotsButton: Locator;
    public deleteButton:Locator;
    public alertDialog:Locator;
    public deleteMessageLabel:Locator;
    public deletePackageButton:Locator;
    public conformationButton:Locator;
    public noResultsLabel:Locator;

    constructor(page: Page) {
        super(page);
        this.threeDotsButton = page.locator("(//a//button[@type='button' and @data-state='closed'])[1]");
        this.deleteButton = page.locator("//*[@role='menuitem']//span[text()='Delete']");
        this.alertDialog = page.locator("//div[@role='alertdialog']");
        this.deleteMessageLabel = page.locator("//p[contains(@class,'text-ui-fg-subtle')]/label[1]");
        this.deletePackageButton = page.locator("//button[text()='Delete']"); 
        this.conformationButton  = page.locator("//button[text()='Yeah, Thanks!']"); 
        this.noResultsLabel = page.locator("text='No results'");

    }

    // Delete package 
    async deletePackage(packageName:string){

        // Click on three dot button
        await this.page.locator('//div[normalize-space()="'+packageName+'"]/ancestor::td/following-sibling::td//button').click();

        // Click on delete button
        await this.clickElement(this.deleteButton);

        // Verify alert dialog open or not and verify alert message also
        expect(await this.isElementVisible(this.alertDialog)).toBe(true);
        expect(await this.deleteMessageLabel.textContent()).toBe('This will permanently delete the package "'+packageName+'" and cannot be undone.');

        // Click on delete program button
        await this.clickElement(this.deletePackageButton);

        // Verify delete success message
        await this.isElementVisible(this.conformationButton);
        expect(await this.deleteMessageLabel.textContent()).toBe(packageName+' was successfully deleted.');

        // click on conformation button
        await this.clickElement(this.conformationButton);

        // verify popup close or not
        expect(await this.alertDialog.isHidden()).toBe(false);
    }

}
  