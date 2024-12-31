import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminDeletePackagesPage } from "../pageObjects/adminDeletePackages";
import { adminViewPackagesPage } from "../pageObjects/adminViewPackages";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewPackagesPage: adminViewPackagesPage;
let deletePackagesPage: adminDeletePackagesPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  viewPackagesPage = new adminViewPackagesPage(page);
  deletePackagesPage = new adminDeletePackagesPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewPackagesPage.packagesButton);
});

test.afterEach(async () => {
  await browser.close();
});

test('TC0089 - verify that the user can access a CTA to delete', async() =>{
    try {
        // Click on three dot button
        await basePage.clickElement(deletePackagesPage.threeDotsButton);

        // Verify delete button is visible
        expect(await basePage.isElementVisible(viewPackagesPage.addpackageButton)).toBe(true);
        
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }

});

test('TC0090 - Verify that if the package is not associated with orders a confirmation prompt appears', async() =>{
    try {
        
        // Delete Package
        deletePackagesPage.deletePackage("");
        
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }

});

test('TC0091 - Verify that if the package is associated with orders an error message appears', async() =>{
    try {
        // Get Package name from Order Page
        const packageName : null|string= await deletePackagesPage.getPackageNameFromOrderPage();

        if (packageName === null) {
            console.error(`Test failed: Null value found while retrieving the text of the package`);
            expect( packageName,'Null value found while retrieving the text of the package.').not.toBeNull();
          }  else{

            console.log("Package Name: "+packageName);

            // Navigate to Packages page
            await basePage.clickElement(viewPackagesPage.packagesButton);

            // Click on Three dot button
            await deletePackagesPage.clickOnThreeButton(packageName);

            // Click on delete button and verify user can not delete package
            await deletePackagesPage.deleteAssociatedPackage(packageName);

          }
      
        
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }

});