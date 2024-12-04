import { Page, Locator } from "@playwright/test";

export class adminHomePage {
  private page: Page;
  private usersButton: Locator;
  private inviteUserButton: Locator;
  private emailInput: Locator;
  private roleSelect: Locator;
  private roleDropdown: Locator;
  private departmentSelect: Locator;
  private departmentDropdown: Locator;
  private groupsSelect: Locator;
  private groupsDropdown: Locator;
  private inviteButton: Locator;
  private inviteSuccessMessage: Locator;
  private inviteRoleErrorMessage: Locator;
  private inviteDepartmentErrorMessage: Locator;
  private inviteGroupsErrorMessage: Locator;
  public emailListItems: Locator;
  private nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersButton = page.locator("//p[text()='Users']");
    this.inviteUserButton = page.locator('//*[@id="root"]/div/div[2]/main/div/div/div/div[1]/button/button');
    this.emailInput = page.locator("//input[@type='email']");
    this.roleSelect = page.locator("//div[@class='flex-1 p-4']//div[2]//button");
    this.roleDropdown = page.locator("//span[text()='Admin']");
    this.departmentSelect = page.locator("//div[@class='flex-1 p-4']//div[3]//button");
    this.departmentDropdown = page.locator("//span[text()='AOU']")
    this.groupsSelect = page.locator("(//div//label[contains(text(),'Groups')]/following::button)[1]");
    this.groupsDropdown = page.locator("//span[text()='Football']")
    this.inviteButton = page.locator("//button[normalize-space()='Invite']");
    this.inviteSuccessMessage = page.locator("span[class='txt-compact-small-plus text-ui-fg-base']");
    this.inviteRoleErrorMessage = page.locator("//span[normalize-space()='Role is required']");
    this.inviteDepartmentErrorMessage = page.locator("//span[normalize-space()='Department is required']");
    this.inviteGroupsErrorMessage = page.locator("//span[normalize-space()='At least one group must be selected']");
    this.emailListItems = page.locator("//tbody[@class='border-ui-border-base border-b-0']//td[2]");
    this.nextButton = page.locator("//button[normalize-space()='Next']");
  }
  async clickUserButton(): Promise<void> {
    await this.usersButton.click();
  }
  async clickInviteUserButton(): Promise<void> {
    await this.inviteUserButton.click();
  }
  async fillInviteUserEmail(inviteEmail: string): Promise<void> {
    await this.emailInput.fill(inviteEmail);
  }
  async fillInviteUserForm(inviteEmail: string): Promise<void> {
    await this.emailInput.fill(inviteEmail);
    await this.roleSelect.click();
    await this.roleDropdown.click();
    await this.departmentSelect.click();
    await this.departmentDropdown.click();
    await this.groupsSelect.click();
    await this.groupsDropdown.click();
  }
  async submitInviteButton(): Promise<void> {
    await this.inviteButton.click();
  }
  async getSuccessMessage(): Promise<string | null> {
    return await this.inviteSuccessMessage.textContent();
  }
  async getErrorRoleMessage(): Promise<string | null> {
    return await this.inviteRoleErrorMessage.textContent();
  }
  async getErrorDepartmentMessage(): Promise<string | null> {
    return await this.inviteDepartmentErrorMessage.textContent();
  }
  async getErrorGroupsMessage(): Promise<string | null> {
    return await this.inviteGroupsErrorMessage.textContent();
  }
  async generateRandomDigits(): Promise<string> {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
  async clickNextUntilDisabled(): Promise<void> {
    while (await this.nextButton.isEnabled()) {
      await this.nextButton.click();
    }
  }
  async isNextButtonDisabled(): Promise<boolean> {
    return await this.nextButton.isDisabled();
  }
}




