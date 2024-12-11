import { Locator, Page } from "@playwright/test";

export class adminForgotPasswordPage {
    private page: Page;
    public resetpasswordLink: Locator;
    public emailInput: Locator;
    public resetPasswordButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.resetpasswordLink = page.locator("//a[text()='Reset Password?']");
        this.emailInput = page.locator("//input[@name='email']");
        this.resetPasswordButton = page.locator("//button[text()='Reset Password']");
    }
}