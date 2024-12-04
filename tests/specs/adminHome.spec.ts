import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminHomePage } from "../pageObjects/adminHomePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let homePage: adminHomePage;

test.beforeEach(async () => {
    browser = await chromium.launch({ headless: false, channel: "chrome" });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1792, height: 1080 });
    loginPage = new adminLoginPage(page);
    homePage = new adminHomePage(page);
    await loginPage.navigate(config.adminPortalUrl);
    await loginPage.login(config.email, config.password);
});
test.afterEach(async () => {
    await browser.close();
});
test("TC00014- Verify that admins can initiate user invitations from the Users screen", async () => {
    const randomDigits: string = await homePage.generateRandomDigits();
    const emailInput = `newkd${randomDigits}@gmail.co`;
    try {
        await homePage.clickUserButton();
        await homePage.clickInviteUserButton();
        await homePage.fillInviteUserForm(emailInput);
        await homePage.submitInviteButton();
        const successMessage = await homePage.getSuccessMessage();
        expect(successMessage).toContain(config.expectedSuccessMessage);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});
test("TC0015 - Verify that admins are required to choose a role and region for new users", async () => {
    try {
        await homePage.clickUserButton();
        await page.waitForTimeout(3000);
        await homePage.clickInviteUserButton();
        await homePage.fillInviteUserEmail(config.inviteEmail);
        await homePage.submitInviteButton();
        const errorRoleMessage = await homePage.getErrorRoleMessage();
        expect(errorRoleMessage).toContain("Role is required");
        const errorDepartmentMessage = await homePage.getErrorDepartmentMessage();
        expect(errorDepartmentMessage).toContain("Department is required");
        const errorGroupsMessage = await homePage.getErrorGroupsMessage();
        expect(errorGroupsMessage).toContain("At least one group must be selected");
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});
test("TC0016 - Verify that the invited user is displayed in the user list", async () => {
    try {
        const randomDigits: string = await homePage.generateRandomDigits();
        const emailInput = `newkd${randomDigits}@gmail.co`;
        await homePage.clickUserButton();
        await homePage.clickInviteUserButton();
        await homePage.fillInviteUserForm(emailInput);
        await homePage.submitInviteButton();
        await page.waitForTimeout(3000);
        await homePage.clickUserButton();
        await homePage.clickNextUntilDisabled();
        await page.waitForTimeout(3000);
        const emailItems = await homePage.emailListItems.all();
        const lastEmailElement = emailItems[emailItems.length - 1];
        const lastEmailText = await lastEmailElement.textContent();
        expect(lastEmailText).toBe(emailInput);
        await page.waitForTimeout(3000);
    } catch (error: any) {
        console.log(`Test failed: ${error.message}`);
        throw error;
    }
});





