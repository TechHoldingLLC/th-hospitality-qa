import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminInviteUserPage } from "../pageObjects/adminInviteUserPage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";
import inviteUserData from "../data/inviteUserData.json";
import { logMessage } from "../../utils/logUtils";
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
  await page.setViewportSize({ width: 1380, height: 950 });
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
    logMessage("Starting test: TC0014 - Admin invitation");
    const email = await basePage.generateNomenclatureEmail("Admin");
    logMessage(`Generated email for admin: ${email}`);

    logMessage("Filling up 'Invite User' form and sending invite...");
    await inviteUserPage.inviteAdminUser(email);

    logMessage("Validating success message after invitation...");
    expect(
      await basePage.getElementText(inviteUserPage.inviteSuccessMessage)
    ).toEqual(inviteUserData.invitationSuccessMessage);

    logMessage("Opening 'Create Account' link from email...");
    await basePage.openCreateAccountLinkFromEmail(email);

    logMessage("Validating navigation URL...");
    expect(page.url()).toContain(
      inviteUserData.urls.expectedBaseURLAdminPortal
    );

    logMessage("Updating admin email in createAccountData.json...");
    const jsonData: any = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (jsonData.hasOwnProperty("adminInviteEmail")) {
      jsonData.adminInviteEmail = email;
    }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
    logMessage("Test TC0014 completed successfully.");
  } catch (error: any) {
    logMessage(`Test TC0014 failed: ${error.message}`);
    throw error;
  }
});

test("TC0108 - Verify that admins can initiate invitations for (coordinator) from the user screen", async () => {
  try {
    logMessage("Starting test: TC0108 - Coordinator invitation");
    const email = await basePage.generateNomenclatureEmail("Coordinator");
    logMessage(`Generated email for coordinator: ${email}`);

    await inviteUserPage.inviteCoordinatorUser(email);

    logMessage("Validating success message after invitation...");
    expect(
      await basePage.getElementText(inviteUserPage.inviteSuccessMessage)
    ).toEqual(inviteUserData.invitationSuccessMessage);

    logMessage("Opening 'Create Account' link from email...");
    await basePage.openCreateAccountLinkFromEmail(email);

    logMessage("Validating navigation URL...");
    expect(page.url()).toContain(
      inviteUserData.urls.expectedBaseURLCoordinator
    );

    logMessage("Updating coordinator email in createAccountData.json...");
    const jsonData: any = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (jsonData.hasOwnProperty("coordinatorInviteEmail")) {
      jsonData.coordinatorInviteEmail = email;
    }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
    logMessage("Test TC0108 completed successfully.");
  } catch (error: any) {
    logMessage(`Test TC0108 failed: ${error.message}`);
    throw error;
  }
});

test("TC0015 - Verify that admins are required to choose an email, role, department, and groups for new users", async () => {
  try {
    logMessage("Starting test: TC0015 - Required fields validation");
    logMessage("Clicking 'Invite' button...");
    await basePage.clickElement(inviteUserPage.inviteButton);

    logMessage("Validating error messages for required fields...");
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

    logMessage("Test TC0015 completed successfully.");
  } catch (error: any) {
    logMessage(`Test TC0015 failed: ${error.message}`);
    throw error;
  }
});

test("TC0016 - Verify that the invited user is displayed in the user list", async () => {
  try {
    logMessage("Starting test: TC0016 - Invited user appears in the list");
    const email = await basePage.generateNomenclatureEmail("Admin");
    logMessage(`Generated email for admin: ${email}`);

    logMessage("Filling up 'Invite User' form and sending invite...");
    await inviteUserPage.inviteAdminUser(email);

    logMessage("Navigating to 'Users' screen...");
    await basePage.clickElement(inviteUserPage.usersButton);

    logMessage("Verifying invited user appears in the list...");
    const invitedEmailLocator = page.locator(`text=${email}`).first();
    expect(await basePage.getElementText(invitedEmailLocator)).toEqual(email);
    expect(
      await basePage.getElementText(
        await inviteUserPage.generateLocatorByEmail(email)
      )
    ).toEqual("Invited");

    logMessage("Test TC0016 completed successfully.");
  } catch (error: any) {
    logMessage(`Test TC0016 failed: ${error.message}`);
    throw error;
  }
});
