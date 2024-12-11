import { Page, Locator } from "@playwright/test";

export class adminHomePage {
  private page: Page;
  public usersButton: Locator;
  public inviteUserButton: Locator;
  public emailInput: Locator;
  public roleSelect: Locator;
  public roleDropdown: Locator;
  public departmentSelect: Locator;
  public departmentDropdown: Locator;
  public groupsSelect: Locator;
  public groupsDropdown: Locator;
  public inviteButton: Locator;
  public inviteSuccessMessage: Locator;
  public inviteRoleErrorMessage: Locator;
  public inviteDepartmentErrorMessage: Locator;
  public inviteGroupsErrorMessage: Locator;
  public firstEmailElement: Locator;

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
    this.firstEmailElement = page.locator("//tbody[@class='border-ui-border-base border-b-0']//tr[1]//td[2]//div[@class='flex size-full items-center pr-6']");
  }
}




