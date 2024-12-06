import { Page, Locator } from "@playwright/test";

export class adminLoginPage {
  private page: Page;
  public emailInput: Locator;
  public passwardInput: Locator;
  public loginButton: Locator;
  public readonly cokeLogo: Locator;
  public errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("//input[@id=':r0:-form-item']");
    this.passwardInput = page.locator("//input[@id=':r1:-form-item']");
    this.loginButton = page.locator('//button[@type="submit"]');
    this.cokeLogo = page.locator("//button[@id='radix-:r5:']");
    this.errorMessage = page.locator("span[class='txt-small text-ui-fg-error grid grid-cols-[20px_1fr] gap-1 items-start']");
  }
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwardInput.fill(password);
    await this.loginButton.click();
  }
  // Verify that the email and password inputs contain the correct values 
  async getEnteredEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }
  async getEnteredPassward(): Promise<string> {
    return await this.passwardInput.inputValue();
  }
}





