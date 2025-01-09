import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { config } from "../config/config.qa";
import { adminCreateEditProgramPage } from "../pageObjects/adminCreateEditProgram";
import { adminViewProgramsPage } from "../pageObjects/adminViewPrograms";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let createProgram: adminCreateEditProgramPage;
let viewProgram: adminViewProgramsPage;

test.beforeEach(async()=>{
    browser = await chromium.launch({headless: false, channel: "chrome"});
    page = await browser.newPage();
    basePage = new BasePage(page);
    loginPage = new adminLoginPage(page);
    createProgram = new adminCreateEditProgramPage(page);
    viewProgram = new adminViewProgramsPage(page);
    // await basePage.navigateTo(config.adminPortalUrl);
    // await loginPage.login(config.email, config.password);
    await basePage.navigateTo("https://admin.dev.hospitality.thinfra.net/login");
    await loginPage.login("superuser@dev.hospitality.thinfra.net", "TestSuperUser%123");
});

test.afterEach(async()=>{
    await browser.close();
});

test("End to end flow", async()=>{
    const programName = await basePage.generateNomenclatureName('Program');
    await basePage.clickElement(viewProgram.programsButton);
    await basePage.clickElement(viewProgram.addProgramButton);
    await createProgram.createProgram(programName);
    expect(
        await basePage.isElementVisible(createProgram.createSuccessMessage)
      ).toBe(true);
});