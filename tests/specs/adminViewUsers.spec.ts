import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminViewUsersPage } from "../pageObjects/adminViewUsers";
import viewUserData from "../data/viewUserData.json";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let viewUsersPage: adminViewUsersPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  viewUsersPage = new adminViewUsersPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0011 - Verify that admins can view a list of users", async () => {
  test.info().annotations.push({ type: 'allure', description: 'TC0011 - Verify that admins can view a list of users'});

  try{
  //Login as admin
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewUsersPage.usersButton);
  //Verify that admins can view a list of users
  expect(await basePage.isElementVisible(viewUsersPage.inviteUserButton)).toBe(
    true
  );
  expect(await basePage.isElementVisible(viewUsersPage.nameHeader)).toBe(true);
}catch (error: any) {
  console.error(`Test failed: ${error.message}`);
  throw error;
}
});

test("TC0013 - Verify that user list and detail shows specified fields like name, email, role, department, group, status and last login", async () => {
  try{
  //Login as admin
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(viewUsersPage.usersButton);

  //Verifying all expected columns are visible on page
  expect(await basePage.isElementVisible(viewUsersPage.nameHeader)).toBe(true);
  expect(await basePage.isElementVisible(viewUsersPage.emailHeader)).toBe(true);
  expect(await basePage.isElementVisible(viewUsersPage.roleHeader)).toBe(true);
  expect(await basePage.isElementVisible(viewUsersPage.departmentHeader)).toBe(
    true
  );
  expect(await basePage.isElementVisible(viewUsersPage.groupsHeader)).toBe(
    true
  );
  expect(await basePage.isElementVisible(viewUsersPage.statusHeader)).toBe(
    true
  );
  expect(await basePage.isElementVisible(viewUsersPage.lastLoginHeader)).toBe(
    true
  );

  //Verifying Name column content text
  await basePage.validateColumnData(viewUsersPage.nameColumnData);

  //Verifying Email column content text
  await basePage.validateColumnData(viewUsersPage.emailColumnData);

  //Verify Role column data
  const roleElements = await viewUsersPage.roleColumnData.all();
  for (const element of roleElements) {
    const textContent = await element.textContent();
    expect(textContent === "Admin" || textContent === "Coordinator").toBe(true);
  }

  //Verifying Department column content text
  await basePage.validateColumnData(viewUsersPage.departmentColumnData);

  //Verifying Groups column content text
  await basePage.validateColumnData(viewUsersPage.groupsColumnData);

  //Verify Status column data
  const statusElements = await viewUsersPage.statusColumnData.all();
  for (const element of statusElements) {
    const textContent = await element.textContent();
    expect(textContent === "Active" || textContent === "Invited").toBe(true);
  }

  //Verify Last Login column data
  await basePage.validateColumnData(viewUsersPage.lastLoginColumnData);
}
catch (error: any) {
  console.error(`Test failed: ${error.message}`);
  throw error;
}
});

test("TC0012 - Verify that coordinators cannot view a list of users", async () => {
  try{
  //Login as coordinator
  await loginPage.login(config.coordinator_email, config.coordinator_password);
  //Verify coordinator doesn't have access to Admin portal, hence can't view Users list
  expect(
    await basePage.getElementText(viewUsersPage.coordinatorAccessDeniedMessage)
  ).toContain(viewUserData.coordinatorAccessDeniedText);
}catch (error: any) {
  console.error(`Test failed: ${error.message}`);
  throw error;
}
});
