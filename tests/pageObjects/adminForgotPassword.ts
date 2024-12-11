import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { config } from "../config/config.qa";

export class adminForgotPasswordPage extends BasePage {

    public resetpasswordLink: Locator;
    public emailInput: Locator;
    public resetPasswordButton: Locator;
    public resetLinkSentSuccessmessage: Locator;
    public mailinatorEmailInput: Locator;
    public mailinatorPassword: Locator;
    public mailinatorLoginBTN: Locator;
    public mailinatorInboxField: Locator;
    public mailinatorGoBTN: Locator;
    public mailinatorFirstEmailRow: Locator;
    public mailinatorLinksTab: Locator;
    public mailinatorResetPasswordButtonLink: Locator;
    public changePasswordButton: Locator;

    constructor(page: Page) {
        super(page);
        this.resetpasswordLink = page.locator("//a[text()='Reset Password?']");
        this.emailInput = page.locator("//input[@name='email']");
        this.resetPasswordButton = page.locator("//button[text()='Reset Password']");
        this.resetLinkSentSuccessmessage = page.locator("//div[@class='mb-4 flex flex-col items-center']");
        this.mailinatorEmailInput = page.locator("#many_login_email");
        this.mailinatorPassword = page.locator("#many_login_password");
        this.mailinatorLoginBTN = page.locator("//a[@class='btn btn-default submit']");
        this.mailinatorInboxField = page.locator("#inbox_field");
        this.mailinatorGoBTN = page.locator("//button[@class='primary-btn']");
        this.mailinatorFirstEmailRow = page.locator("//table[@class='table-striped jambo_table']//tr[1]");
        this.mailinatorLinksTab = page.locator("#pills-links-tab");
        this.mailinatorResetPasswordButtonLink = page.locator("//td[text()='Reset Password']/following-sibling::td//a");
        this.changePasswordButton = page.locator("//button[@type='submit']");
    }

    async mailinatorLogin(): Promise<void> {
        await this.navigateTo('https://www.mailinator.com/v4/login.jsp');
        await this.enterValuesInElement(this.mailinatorEmailInput, config.email)
        await this.enterValuesInElement(this.mailinatorPassword, 'QAteam@2024');
        await this.clickElement(this.mailinatorLoginBTN);
    }

    async navigateToResetPaswordPageFromMailinatorInbox(): Promise<Page> {
        await this.enterValuesInElement(this.mailinatorInboxField, 'resetUser');
        await this.clickElement(this.mailinatorGoBTN);
        await this.clickElement(this.mailinatorFirstEmailRow);
        await this.clickElement(this.mailinatorLinksTab);
        //Listen for the new tab
        const [newTab] = await Promise.all([
            // Wait for a new page (tab) to open
            this.page.context().waitForEvent('page'),
            // Click the link that opens the new tab
            await this.clickElement(this.mailinatorResetPasswordButtonLink)
        ]);
        //Wait for the new tab to load
        await newTab.waitForLoadState();
        return newTab;
    }
}