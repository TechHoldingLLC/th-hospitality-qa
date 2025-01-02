import { Locator, Page } from "@playwright/test";

export class adminViewProgramsPage {
  private page: Page;
  public programsButton: Locator;
  public addProgramButton: Locator;
  public programNameHeader: Locator;
  public departmentHeader: Locator;
  public groupsHeader: Locator;
  public eventDateRangeHeader: Locator;
  public noOfEventsHeader: Locator;
  public noOfPackagesHeader: Locator;
  public noOfOrdersHeader: Locator;
  public groupsColumnData: Locator;
  public departmentColumnData: Locator;
  public eventDateRangeColumnData: Locator;
  public noOfEventsColumnData: Locator;
  public noOfPackagesColumnData: Locator;
  public kebabMenuIcon: Locator;
  public deleteButton: Locator;
  public editButton: Locator;
  public editProgramHeader: Locator;
  public confirmDeleteButton: Locator;
  public addProgramHeader: Locator;
  public deleteProgramConfirmation: Locator;
  public addFilterButton: Locator;
  public departmentMenuItem: Locator;
  public departmentListFromMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.programsButton = page.locator("//a[@href='/programs']");
    this.addProgramButton = page.locator("//a[@href='/programs/create']");
    this.programNameHeader = page.locator("//span[text()='Program Name']");
    this.departmentHeader = page.locator("//span[text()='Department']");
    this.groupsHeader = page.locator("//span[text()='Groups']");
    this.eventDateRangeHeader = page.locator(
      "//span[text()='Event Date / Range']"
    );
    this.noOfEventsHeader = page.locator("//span[text()='# of Events']");
    this.noOfPackagesHeader = page.locator("//span[text()='# of Packages']");
    this.noOfOrdersHeader = page.locator("//span[text()='# of Orders']");
    this.groupsColumnData = page.locator(
      "//table[@class='text-ui-fg-subtle txt-compact-small relative w-full']//td[3]"
    );
    this.departmentColumnData = page.locator(
      "//table[@class='text-ui-fg-subtle txt-compact-small relative w-full']//td[2]"
    );
    this.eventDateRangeColumnData = page.locator(
      "//table[@class='text-ui-fg-subtle txt-compact-small relative w-full']//td[4]"
    );
    this.noOfEventsColumnData = page.locator(
      "//table[@class='text-ui-fg-subtle txt-compact-small relative w-full']//td[5]"
    );
    this.noOfPackagesColumnData = page.locator(
      "//table[@class='text-ui-fg-subtle txt-compact-small relative w-full']//td[6]"
    );
    this.kebabMenuIcon = page.locator("//tbody//tr[1]//button");
    this.deleteButton = page.locator("//span[text()='Delete']");
    this.editButton = page.locator("//span[text()='Edit']");
    this.editProgramHeader = page.locator("//h1[text()='Edit Program']");
    this.confirmDeleteButton = page.locator("//button[text()='Delete']");
    this.addProgramHeader = page.locator("//h1[text()='Add Program']");
    this.deleteProgramConfirmation = page.locator("//button[text()='Delete']");
    this.addFilterButton = page.locator("button#filters_menu_trigger");
    this.departmentMenuItem = page.locator(
      "//div[@role='menuitem' and text()='Department']"
    );
    this.departmentListFromMenuItem = page.locator("//div[@role='option']");
  }
}
