import { Locator, Page } from "@playwright/test";

export class adminViewEventsPage {
  private page: Page;
  public eventsButton: Locator;
  public eventNameLabel: Locator;
  public programNameLabel: Locator;
  public eventDateLabel: Locator;
  public departmentLabel: Locator;
  public groupsLabel: Locator;
  public noOfPackagesLabel: Locator;
  public statusLabel: Locator;
  public eventCreateButton: Locator;
  public eventNameColumnData: Locator;
  public programNameColumnData: Locator;
  public eventDateColumnData: Locator;
  public departmentColumnData: Locator;
  public groupsColumnData: Locator;
  public noOfPackagesColumnData: Locator;
  public statusColumnData: Locator;
  public kebabMenu: Locator;
  public editButton: Locator;
  public deleteButton: Locator;
  public addEventHeader: Locator;
  public editEventHeader: Locator;
  public confirmDeleteButton: Locator;
  public paginationFooter: Locator;
  public eventList: Locator;
  public nextButton: Locator;
  public prevButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventsButton = page.locator("//a[@href='/events']");
    this.eventNameLabel = page.locator("//span[text()='Event Name']");
    this.programNameLabel = page.locator("//span[text()='Program Name']");
    this.eventDateLabel = page.locator("//span[text()='Event Date']");
    this.departmentLabel = page.locator("//span[text()='Departments']");
    this.groupsLabel = page.locator("//span[text()='Groups']");
    this.noOfPackagesLabel = page.locator(
      "//span[text()='Number of packages ']"
    );
    this.statusLabel = page.locator("//span[text()='Status']");
    this.eventCreateButton = page.locator("//a[@href='/events/create']");
    this.eventNameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.programNameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[2]"
    );
    this.eventDateColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[3]"
    );
    this.departmentColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[4]"
    );
    this.groupsColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[5]"
    );
    this.noOfPackagesColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[6]"
    );
    this.statusColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[7]"
    );
    this.kebabMenu = page.locator("//tbody//tr[1]//td[8]");
    this.editButton = page.locator("//span[text()='Edit']");
    this.deleteButton = page.locator("//span[text()='Delete']");
    this.addEventHeader = page.locator("//h1[text()='Event Information']");
    this.editEventHeader = page.locator("//h1[text()='Edit Event']");
    this.confirmDeleteButton = page.locator("//button[text()='Delete']");
    this.paginationFooter = page.locator(
      "//div[@class='text-ui-fg-subtle txt-compact-small-plus flex w-full items-center justify-between px-3 py-4 flex-shrink-0']"
    );
    this.eventList = page.locator("//tbody//tr");
    this.nextButton = page.locator("//button[text()='Next']");
    this.prevButton = page.locator("//button[text()='Prev']");
  }
}
