import { Locator, Page } from "@playwright/test";

export class adminViewProductsPage {
  private page: Page;
  public productsButton: Locator;
  public addProductButton: Locator;
  public productNameHeader: Locator;
  public productTypeHeader: Locator;
  public programNameHeader: Locator;
  public eventNameHeader: Locator;
  public dateRangeHeader: Locator;
  public noOfPackagesHeader: Locator;
  public totalQuantityHeader: Locator;
  public productNameColumnData: Locator;
  public productTypeColumnData: Locator;
  public programNameColumnData: Locator;
  public eventNameColumnData: Locator;
  public dateRangeColumnData: Locator;
  public noOfPackagesColumnData: Locator;
  public totalQuantityColumnData: Locator;
  public kebabMenu: Locator;
  public editButton: Locator;
  public deleteButton: Locator;
  public confirmDeleteButton: Locator;
  public addProductForm: Locator;
  public cancelButton: Locator;
  public editProductHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsButton = page.locator("//a[@href='/products']");
    this.addProductButton = page.locator("//a[@href='/products/create']");
    this.productNameHeader = page.locator(
      "//span[normalize-space()='Product Name']"
    );
    this.productTypeHeader = page.locator(
      "//span[normalize-space()='Product Type']"
    );
    this.programNameHeader = page.locator(
      "//span[normalize-space()='Program Name']"
    );
    this.eventNameHeader = page.locator(
      "//span[normalize-space()='Event Name']"
    );
    this.dateRangeHeader = page.locator(
      "//span[normalize-space()='Date Range']"
    );
    this.noOfPackagesHeader = page.locator(
      "//span[normalize-space()='# of Packages']"
    );
    this.totalQuantityHeader = page.locator(
      "//span[normalize-space()='Total Quantity']"
    );
    this.productNameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[1]"
    );
    this.productTypeColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[2]"
    );
    this.programNameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[3]"
    );
    this.eventNameColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[4]"
    );
    this.dateRangeColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[5]"
    );
    this.noOfPackagesColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[6]"
    );
    this.totalQuantityColumnData = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//td[7]"
    );
    this.kebabMenu = page.locator("//tbody//tr[1]//td[8]");
    this.editButton = page.locator("//span[text()='Edit']");
    this.deleteButton = page.locator("//span[text()='Delete']");
    this.confirmDeleteButton = page.locator("//button[text()='Delete']");
    this.addProductForm = page
      .locator("//div[@class='px-6 py-4 flex flex-1 flex-col gap-3 pt-3 pb-0']")
      .first();
    this.cancelButton = page.locator(
      "//div[@role='dialog'][1]//button[text()='Cancel']"
    );
    this.editProductHeader = page.locator(
      "//h1[@class='font-sans font-medium h1-core']"
    );
  }
}
