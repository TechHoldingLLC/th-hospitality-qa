import { Locator, Page } from "@playwright/test";

export class adminViewPackagesPage {
  private page: Page;
  public packagesButton: Locator;
  public addpackageButton: Locator;
  public packageNameLabel: Locator;
  public associatedProgramLabel: Locator;
  public productsLabel: Locator;
  public departmentLabel: Locator;
  public groupsLabel: Locator;
  public priceLabel: Locator;
  public quantityAvailableLabel: Locator;
  public packageNameColumnData: Locator;
  public associatedProgramColumnData: Locator;
  public productsColumnData: Locator;
  public departmentColumnData: Locator;
  public groupsColumnData: Locator;
  public priceColumnData: Locator;
  public quantityAvailableColumnData: Locator;
  public kebabMenu: Locator;
  public editButton: Locator;
  public deleteButton: Locator;
  public confirmDeleteButton: Locator;
  public addPackageForm: Locator;
  public editPackageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.packagesButton = page.locator("//a[@href='/packages']");
    this.addpackageButton = page.locator("//a[@href='/packages/create']");
    this.packageNameLabel = page.locator("//span[text()='Package Name']");
    this.associatedProgramLabel = page.locator(
      "//span[text()='Associated Program']"
    );
    this.productsLabel = page.locator("//span[text()='Products']");
    this.departmentLabel = page.locator("//span[text()='Departments']");
    this.groupsLabel = page.locator("//span[text()='Groups']");
    this.priceLabel = page.locator("//span[text()='Currency Price']");
    this.quantityAvailableLabel = page.locator(
      "//span[text()='Quantity Available']"
    );
    this.packageNameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.associatedProgramColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.productsColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.departmentColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.groupsColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.priceColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.quantityAvailableColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.kebabMenu = page.locator("//tbody//tr[1]//td[8]");
    this.editButton = page.locator("//span[text()='Edit']");
    this.deleteButton = page.locator("//span[text()='Delete']");
    this.confirmDeleteButton = page.locator("//button[text()='Delete']");
    this.addPackageForm = page.locator("//div[@role='dialog']").first();
    this.editPackageHeader = page.locator("//h1[text()='Edit Package']");
  }
}
