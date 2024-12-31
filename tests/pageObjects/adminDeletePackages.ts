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

    // order page Locator
    public orderButton:Locator;
    public orderListLink:Locator;
    public packagesButton:Locator;
    public packageNameFromTable:Locator;

    constructor(page: Page) {
        super(page);
        this.threeDotsButton = page.locator("(//a//button[@type='button' and @data-state='closed'])[1]");
        this.deleteButton = page.locator("//*[@role='menuitem']//span[text()='Delete']");
        this.alertDialog = page.locator("//div[@role='alertdialog']");
        this.deleteMessageLabel = page.locator("//p[contains(@class,'text-ui-fg-subtle')]/label[1]");
        this.deletePackageButton = page.locator("//button[text()='Delete']"); 
        this.conformationButton  = page.locator("//button[text()='Yeah, Thanks!']"); 
        this.noResultsLabel = page.locator("text='No results'");
        this.orderButton = page.locator("//a[@href='/orders']");
        this.orderListLink = page.locator("//table//tr/td[1]//a");
        this.packagesButton = page.locator("//div[@role='tablist']/button[text()='Packages']");
        this.packageNameFromTable = page.locator("//div[contains(@id,'package')]//table//tr/td[1]");

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

        // Click on conformation button
        await this.clickElement(this.conformationButton);

        // Verify popup close or not
        expect(await this.alertDialog.isHidden()).toBe(false);
    }

    // Get Package name from Order page
    async getPackageNameFromOrderPage():Promise<null | string>{

        // Naviage to Orders page
        await this.clickElement(this.orderButton);

        // Naviate to Order Details page
        await this.clickElement(this.orderListLink.first());

        // Click on Package button
        await this.clickElement(this.packagesButton);

        // Get text from package list 
        await this.waitForElementVisible(this.packageNameFromTable); 
        return await this.packageNameFromTable.textContent();
    }

}
  