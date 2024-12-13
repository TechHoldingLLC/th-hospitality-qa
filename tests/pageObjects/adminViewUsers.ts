import { Locator, Page } from "@playwright/test";

export class adminViewUsersPage {
  private page: Page;
  public usersButton: Locator;
  public inviteUserButton: Locator;
  public nameHeader: Locator;
  public emailHeader: Locator;
  public roleHeader: Locator;
  public departmentHeader: Locator;
  public groupsHeader: Locator;
  public statusHeader: Locator;
  public lastLoginHeader: Locator;
  public userDetailLocation: Locator;
  public userDetailEmail: Locator;
  public userDetailRole: Locator;
  public userDetailDepartment: Locator;
  public userDetailGroups: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersButton = page.locator("//a[@href='/users']");
    this.inviteUserButton = page.locator("//a[@href='/users/invite']");
    this.nameHeader = page.locator("//th[@data-table-header-id='name']");
    this.emailHeader = page.locator("//th[@data-table-header-id='email']");
    this.roleHeader = page.locator(
      "//th[@data-table-header-id='user_extended_role']"
    );
    this.departmentHeader = page.locator(
      "//th[@data-table-header-id='user_extended_department']"
    );
    this.groupsHeader = page.locator(
      "//th[@data-table-header-id='user_extended_groups']"
    );
    this.statusHeader = page.locator(
      "//th[@data-table-header-id='user_extended_status']"
    );
    this.lastLoginHeader = page.locator(
      "//th[@data-table-header-id='user_extended_lastLogin']"
    );
    this.userDetailLocation = page.locator(
      "//p[@class='font-normal font-sans txt-small text-gray-600']"
    );
    this.userDetailEmail = page.locator(
      "//p[text()='Email']/following-sibling::p"
    );
    this.userDetailRole = page.locator(
      "//p[text()='Role']/following-sibling::p"
    );
    this.userDetailDepartment = page.locator(
      "//p[text()='Department']/following-sibling::p"
    );
    this.userDetailGroups = page.locator(
      "//span[@class='px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full']"
    );
  }
}
