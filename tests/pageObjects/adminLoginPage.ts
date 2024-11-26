import { Page, Locator } from "@playwright/test";

export class adminLoginPage {
  private page: Page;
  private emailInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private readonly cokeLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("//input[@id=':r0:-form-item']");
    this.passwordInput = page.locator("//input[@id=':r1:-form-item']");
    this.loginButton = page.locator('//button[@type="submit"]');
    this.cokeLogo = page.locator("//button[@id='radix-:r5:']");
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
  async loginInvalid(email: string, incorrectPassword: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(incorrectPassword);
    await this.clickLoginButton();
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.page
      .locator(
        "span[class='txt-small text-ui-fg-error grid grid-cols-[20px_1fr] gap-1 items-start']"
      )
      .textContent();
  }
  async isCokeLogoVisible(): Promise<boolean> {
    return await this.cokeLogo.isVisible();
  }
}
