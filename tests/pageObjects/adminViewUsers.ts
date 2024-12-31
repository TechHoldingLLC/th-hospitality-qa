import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminViewUsersPage extends BasePage{
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
  public nameColumnData: Locator;
  public emailColumnData: Locator;
  public roleColumnData: Locator;
  public departmentColumnData: Locator;
  public groupsColumnData: Locator;
  public statusColumnData: Locator;
  public lastLoginColumnData: Locator;
  public coordinatorAccessDeniedMessage: Locator;
  public addFilterButton: Locator;
  public firstNameMenuItem: Locator;
  public filterInputField:Locator;
  public noResultsLabel:Locator;

  constructor(page: Page) {
    super(page);
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
    this.nameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.emailColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[2]"
    );
    this.roleColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[3]"
    );
    this.departmentColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[4]"
    );
    this.groupsColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[5]"
    );
    this.statusColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[6]"
    );
    this.lastLoginColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[7]"
    );
    this.coordinatorAccessDeniedMessage = page.locator(
      "//span[text()='Incorrect email or password. Please try again.']"
    );
    this.addFilterButton = page.locator("button#filters_menu_trigger");
    this.firstNameMenuItem = page.locator("//div[@role='menuitem' and text()='First Name']");
    this.filterInputField = page.locator("//div[@role='dialog']//input");
    this.noResultsLabel = page.locator("text='No results'");
 
  }

  // Filter data
  async filterData(menuItemElement:Locator,inputData:string){
    // Click on Add Filter button
    await this.clickElement(this.addFilterButton);

    // Click on filter option
    await this.clickElement(menuItemElement);

    // Enter value in filter Input Field
    await this.enterValuesInElement(this.filterInputField, inputData);

  }
}
