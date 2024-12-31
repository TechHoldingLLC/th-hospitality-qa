import { expect,Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import deletePackagesData from "../data/deletePackagesData.json";

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
    public gotItButton:Locator;
    public nextButton:Locator;

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
        this.gotItButton = page.locator("//button[text()='Got it']");
        this.nextButton = page.locator("//button[text()='Next']");

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

        // Click on delete package button
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
        await this.selectRandomItemFromMultiSelectList(this.orderListLink);

        // Click on Package button
        await this.clickElement(this.packagesButton);

        await this.page.waitForTimeout(3000);

        // Get text from package list 
        await this.waitForElementVisible(this.packageNameFromTable.first()); 
        return await this.packageNameFromTable.first().textContent();
    }

    // Find package and click on three dot button
    async clickOnThreeButton(packageName:string){

        const packageLocator: Locator = this.page.locator('//div[normalize-space()="'+packageName+'"]/ancestor::td/following-sibling::td//button');

        // check package is display in page or not
        await this.page.waitForTimeout(3000);
        let productFound:boolean = (await packageLocator.isVisible()).valueOf();

        if(!productFound){
              let isnextButtonEnabled:boolean = (await this.nextButton.isEnabled()).valueOf();

              if(isnextButtonEnabled){
                // click on next button
                await this.clickElement(this.nextButton); 

                // wait for page load
                 await this.page.waitForLoadState('domcontentloaded');

                  await this.clickOnThreeButton(packageName);
            } else{
                console.log(packageName+" is not found in this page")
                expect(false).toBeTruthy();
            }
        } else {

            // click on product link
            await this.clickElement(packageLocator);
            await this.page.waitForLoadState('networkidle');

            // verifty porperly navigate or not
            expect(await this.deleteButton.isVisible()).toBe(true);
        }

    }

    // Delete Assoicated Package and verify warning message
    async deleteAssociatedPackage(packageName:string){

         // Click on delete button
         await this.clickElement(this.deleteButton);

         // Verify alert dialog open or not and verify alert message also
         expect(await this.isElementVisible(this.alertDialog)).toBe(true);
         expect(await this.deleteMessageLabel.textContent()).toBe('This will permanently delete the package "'+packageName+'" and cannot be undone.');
 
         // Click on delete package button
         await this.clickElement(this.deletePackageButton); 
         
         await this.page.waitForTimeout(2000);

         // Verify delete success message
         await this.isElementVisible(this.gotItButton);
         expect(await this.deleteMessageLabel.textContent()).toBe(deletePackagesData.AssociatedPackageNotDeleteMessage);
        
         // Click on conformation button
         await this.clickElement(this.gotItButton);
         
         // Verify popup close or not
         expect(await this.waitForElementHidden(this.gotItButton)).not.toBe(false);
    }

}
  