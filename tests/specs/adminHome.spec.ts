import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminHomePage } from "../pageObjects/adminHomePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let homePage: adminHomePage;
let basePage: BasePage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1380, height: 950 });
    basePage = new BasePage(page);
    loginPage = new adminLoginPage(page);
    homePage = new adminHomePage(page);
    await basePage.navigateTo(config.adminPortalUrl);
    await loginPage.login(config.email, config.passward);
    await basePage.clickElement(homePage.usersButton);
    await basePage.clickElement(homePage.inviteUserButton);
});
test.afterEach(async () => {
    await browser.close();
});
test("TC00014- Verify that admins can initiate user invitations from the Users screen", async () => {
    // Generate random digits for email
    const randomDigits = await basePage.generateRandomDigits();
    // Create a dynamic email
    const inviteGmail: string = `test123${randomDigits}@gmail.com`;
    try {
        // Fill up 'Invite User Form'
        await basePage.enterValuesInElement(homePage.emailInput, inviteGmail);
        await basePage.clickElement(homePage.roleSelect);
        await basePage.clickElement(homePage.roleDropdown);
        await basePage.clickElement(homePage.departmentSelect);
        await basePage.clickElement(homePage.departmentDropdown);
        await basePage.clickElement(homePage.groupsSelect);
        await basePage.clickElement(homePage.groupsDropdown);
        // Navigation to Invite Page
        await basePage.clickElement(homePage.inviteButton);
        // Validate success message after invitation
        const succesMessageText: string | null = await basePage.getElementText(homePage.inviteSuccessMessage);
        expect(succesMessageText).toEqual(config.expectedSuccessMessage);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});
test("TC0015 - Verify that admins are required to choose a role and region for new users", async () => {
    try {
        // Enter email for invitation
        await basePage.enterValuesInElement(homePage.emailInput, config.inviteEmail);
        // // Try to Navigation to Invite button without selecting role/region
        await basePage.clickElement(homePage.inviteButton);
        // Validate error messages when required fields are not filled
        const roleErrorMessage: string | null = await basePage.getElementText(homePage.inviteRoleErrorMessage);
        expect(roleErrorMessage).toEqual(config.expectedroleErrorMessage);
        const departmentErrorMessage: string | null = await basePage.getElementText(homePage.inviteDepartmentErrorMessage);
        expect(departmentErrorMessage).toEqual(config.expecteddepartmentErrorMessage);
        const groupsErrorMessage: string | null = await basePage.getElementText(homePage.inviteGroupsErrorMessage);
        expect(groupsErrorMessage).toEqual(config.expectedgroupsErrorMessage);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});
test("TC0016 - Verify that the invited user is displayed in the user list", async () => {
    try {
        const randomDigits = await basePage.generateRandomDigits();
        const inputGmail: string = `test123${randomDigits}@gmail.com`;
        //Fill up 'Invite User Form'   
        await basePage.enterValuesInElement(homePage.emailInput, inputGmail);
        await basePage.clickElement(homePage.roleSelect);
        await basePage.clickElement(homePage.roleDropdown);
        await basePage.clickElement(homePage.departmentSelect);
        await basePage.clickElement(homePage.departmentDropdown);
        await basePage.clickElement(homePage.groupsSelect);
        await basePage.clickElement(homePage.groupsDropdown);
        // Click on Invite button
        await basePage.clickElement(homePage.inviteButton);
        // Click on Users button again to view user list
        await basePage.clickElement(homePage.usersButton);
        // Get First email items 
        const invitedEmailLocator = page.locator(`text=${inputGmail}`).first();
        expect(await basePage.getElementText(invitedEmailLocator)).toEqual(inputGmail);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});





