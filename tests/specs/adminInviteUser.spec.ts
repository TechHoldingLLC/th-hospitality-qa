import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminInviteUserPage } from "../pageObjects/adminInviteUserPage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";
import inviteUserData from "../data/inviteUserData.json";
import fs from "fs";
import path from "path";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let inviteUserPage: adminInviteUserPage;
let basePage: BasePage;
const filePath = path.resolve(__dirname, "../data/createAccountData.json");

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  inviteUserPage = new adminInviteUserPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(inviteUserPage.usersButton);
  await basePage.clickElement(inviteUserPage.inviteUserButton);
});
test.afterEach(async () => {
  await browser.close();
});

test("TC0014 - Verify that admins can initiate invitations for (admin) from the user screen", async () => {
  try {
    const email = await basePage.generateNomenclatureEmail("Admin");
    //Fill up 'Invite User' form and send invite to admin user
    await inviteUserPage.inviteAdminUser(email);
    // Validate success message after invitation
    expect(
      await basePage.getElementText(inviteUserPage.inviteSuccessMessage)
    ).toEqual(inviteUserData.invitationSuccessMessage);

    //Click on 'Create Account' button from email body and verify navigation URL
    await basePage.yopmailLogin(email);
    await basePage.openCreateAccountLinkFromEmail();
    expect(page.url()).toContain(
      inviteUserData.urls.expectedBaseURLAdminPortal
    );

    //Update Admin email in createAccountData.json file
    const jsonData: any = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (jsonData.hasOwnProperty("adminInviteEmail")) {
      jsonData.adminInviteEmail = email;
    }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0108 - Verify that admins can initiate invitations for (coordinator) from the user screen", async () => {
  try {
    const email = await basePage.generateNomenclatureEmail("Coordinator");
    //Fill up 'Invite User' form and send invite to coordinator user
    await inviteUserPage.inviteCoordinatorUser(email);
    // Validate success message after invitation
    expect(
      await basePage.getElementText(inviteUserPage.inviteSuccessMessage)
    ).toEqual(inviteUserData.invitationSuccessMessage);

    //Click on 'Create Account' button from email body and verify navigation URL
    await basePage.yopmailLogin(email);
    await basePage.openCreateAccountLinkFromEmail();
    expect(page.url()).toContain(
      inviteUserData.urls.expectedBaseURLCoordinator
    );
    //Update Coordinator email in createAccountData.json file
    const jsonData: any = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (jsonData.hasOwnProperty("coordinatorInviteEmail")) {
      jsonData.coordinatorInviteEmail = email;
    }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0015 - Verify that admins are required to choose an email, role, department and groups for new users", async () => {
  try {
    await basePage.clickElement(inviteUserPage.inviteButton);
    //Validate error messages when required fields are submitted empty
    expect(
      await basePage.getElementText(inviteUserPage.inviteEmailErrorMessage)
    ).toEqual(inviteUserData.emailValidationText);
    expect(
      await basePage.getElementText(inviteUserPage.inviteRoleErrorMessage)
    ).toEqual(inviteUserData.roleValidationText);
    expect(
      await basePage.getElementText(inviteUserPage.inviteDepartmentErrorMessage)
    ).toEqual(inviteUserData.departmentValidationText);
    expect(
      await basePage.getElementText(inviteUserPage.inviteGroupsErrorMessage)
    ).toEqual(inviteUserData.groupsValidationText);
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0016 - Verify that the invited user is displayed in the user list", async () => {
  try {
    const email = await basePage.generateNomenclatureEmail("Admin");
    //Fill up 'Invite User' form and send invite to admin user
    await inviteUserPage.inviteAdminUser(email);
    await basePage.waitForElementToAppearAndDisappear(
      inviteUserPage.inviteSuccessMessage
    );
    await basePage.clickElement(inviteUserPage.usersButton);
    await basePage.waitForPageToBeReady();

    //Verify invited user appears in list
    const invitedEmailLocator = page.locator(`span[title="${email}"]`).first();
    expect(await basePage.isElementVisible(invitedEmailLocator)).toBe(true);
    expect(
      await basePage.getElementText(
        await inviteUserPage.generateLocatorByEmail(email)
      )
    ).toEqual("Invited");
  } catch (error: any) {
    console.log(`Test failed: ${error.message}`);
    throw error;
  }
});
