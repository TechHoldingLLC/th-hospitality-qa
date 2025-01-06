import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class adminInviteUserPage extends BasePage {
  public usersButton: Locator;
  public inviteUserButton: Locator;
  public emailInput: Locator;
  public roleSelect: Locator;
  public roleAdmin: Locator;
  public roleCoordinator: Locator;
  public departmentDropdown: Locator;
  public groupsSelect: Locator;
  public groupsDropdown: Locator;
  public inviteButton: Locator;
  public inviteSuccessMessage: Locator;
  public inviteRoleErrorMessage: Locator;
  public inviteDepartmentErrorMessage: Locator;
  public inviteGroupsErrorMessage: Locator;
  public firstEmailElement: Locator;
  public inviteEmailErrorMessage: Locator;
  public cancelButton: Locator;
  public confirmCancelButton: Locator;
  public allAccessGroup: Locator;

  constructor(page: Page) {
    super(page);
    this.usersButton = page.locator("//a[@href='/users']");
    this.inviteUserButton = page.locator("//a[@href='/users/invite']");
    this.emailInput = page.locator("//input[@type='email']");
    this.roleSelect = page.locator("//span[text()='Select a role']");
    this.roleAdmin = page.locator("//span[text()='Admin']");
    this.roleCoordinator = page.locator("//span[text()='Coordinator']");

    this.departmentDropdown = page.locator(
      "//label[@for='select_department']/following-sibling::div[1]//select"
    );
    this.groupsSelect = page.locator("//div[@class='relative']//button");
    this.groupsDropdown = page.locator(
      "//div[@class='absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto']//div"
    );
    this.inviteButton = page.locator("//button[normalize-space()='Invite']");
    this.inviteSuccessMessage = page.locator(
      "//span[text()='The invitation has been successfully sent.']"
    );
    this.inviteRoleErrorMessage = page.locator(
      "//span[normalize-space()='Role is required']"
    );
    this.inviteDepartmentErrorMessage = page.locator(
      "//span[normalize-space()='Department is required']"
    );
    this.inviteGroupsErrorMessage = page.locator(
      "//span[normalize-space()='At least one group must be selected']"
    );
    this.firstEmailElement = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr[1]//td[2]//div[@class='flex size-full items-center pr-6']"
    );
    this.inviteEmailErrorMessage = page.locator(
      "//span[text()='Invalid email address']"
    );
    this.cancelButton = page.locator("//button[text()='Cancel']");
    this.confirmCancelButton = page.locator("//button[text()='Continue']");
    this.allAccessGroup = page.locator("//input[@id='checkbox-ALL_ACCESS']/following-sibling::span");
  }

  async inviteAdminUser(email: string): Promise<void> {
    await this.enterValuesInElement(this.emailInput, email);
    await this.clickElement(this.roleSelect);
    await this.clickElement(this.roleAdmin);
    await this.clickOnRandomOptionFromDropdown(this.departmentDropdown);
    await this.clickElement(this.groupsSelect);
    await this.selectRandomItemFromMultiSelectList(this.groupsDropdown);
    await this.clickElement(this.inviteButton);
  }

  async inviteCoordinatorUser(email: string): Promise<void> {
    await this.enterValuesInElement(this.emailInput, email);
    await this.clickElement(this.roleSelect);
    await this.clickElement(this.roleCoordinator);
    await this.departmentDropdown.selectOption({value:'All'})
    await this.clickElement(this.groupsSelect);
    await this.clickElement(this.allAccessGroup);
    await this.clickElement(this.inviteButton);
  }

  async generateLocatorByEmail(email: string): Promise<Locator> {
    const xpath = `//*[text()='${email}']/../../../following-sibling::td[4]`;
    return this.page.locator(xpath);
  }
}
