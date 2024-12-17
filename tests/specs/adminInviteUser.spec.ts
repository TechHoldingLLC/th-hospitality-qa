import { expect, test, Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { adminInviteUserPage } from "../pageObjects/adminInviteUserPage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import BasePage from "../pageObjects/basePage";

let browser: Browser;
let page: Page;
let loginPage: adminLoginPage;
let inviteUserPage: adminInviteUserPage;
let basePage: BasePage;
const emailValidationText = "Invalid email address";
const invitationSuccessMessage = "Invitation sent successfully!";
const roleValidationText = "Role is required";
const departmentValidationText = "Department is required";
const groupsValidationText = "At least one group must be selected";
const expectedBaseURLAdminPortal =
  "https://admin.qa.hospitality.thinfra.net/create-account";
const expectedBaseURLCoordinator =
  "https://shop.qa.hospitality.thinfra.net/us/auth/create-account";

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
    const email = await basePage.generateNomenclatureEmail("Admin");
    //Fill up 'Invite User' form and send invite to admin user
    await inviteUserPage.inviteAdminUser(email);
    // Validate success message after invitation
    expect(
      await basePage.getElementText(inviteUserPage.inviteSuccessMessage)
    ).toEqual(invitationSuccessMessage);

    //Click on 'Create Account' button from email body and verify navigation URL
    await basePage.openCreateAccountLinkFromEmail(email);
    expect(page.url()).toContain(expectedBaseURLAdminPortal);
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
    ).toEqual(invitationSuccessMessage);

    //Click on 'Create Account' button from email body and verify navigation URL
    await basePage.openCreateAccountLinkFromEmail(email);
    expect(page.url()).toContain(expectedBaseURLCoordinator);
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
    ).toEqual(emailValidationText);
    expect(
      await basePage.getElementText(inviteUserPage.inviteRoleErrorMessage)
    ).toEqual(roleValidationText);
    expect(
      await basePage.getElementText(inviteUserPage.inviteDepartmentErrorMessage)
    ).toEqual(departmentValidationText);
    expect(
      await basePage.getElementText(inviteUserPage.inviteGroupsErrorMessage)
    ).toEqual(groupsValidationText);
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

    await basePage.clickElement(inviteUserPage.usersButton);
    //Verify invited user appears in list
    const invitedEmailLocator = page.locator(`text=${email}`).first();
    expect(await basePage.getElementText(invitedEmailLocator)).toEqual(email);
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
