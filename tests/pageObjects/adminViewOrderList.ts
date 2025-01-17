import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminViewOrderListPage extends BasePage {
  public ordersButton: Locator;
  public orderIdHeader: Locator;
  public orderDateHeader: Locator;
  public orderStatusHeader: Locator;
  public coordinatorHeader: Locator;
  public programNameHeader: Locator;
  public noOfPackagesHeader: Locator;
  public guestsHeader: Locator;
  public orderTotalHeader: Locator;
  public approvingManagerHeader: Locator;
  public orderIdColumnDataList: Locator;
  public coordinatorColumnDataList: Locator;
  public orderDateColumnDataList: Locator;
  public orderStatusColumnDataList: Locator;
  public programNameColumnDataList: Locator;
  public noOfPackagesColumnDataList: Locator;
  public guestsColumnDataList: Locator;
  public orderTotalColumnDataList: Locator;
  public approvingManagerColumnDataList: Locator;
  public orderDetailsSection: Locator;
  public approveOrderButton: Locator;
  public cancelOrderButton: Locator;
  public denyOrderButton: Locator;
  public editOrderButton: Locator;
  public actionColumnList: Locator;
  public nextButton: Locator;
  public orderAppoveSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.ordersButton = page.locator("//a[@href='/orders']");
    this.orderIdHeader = page.locator("//th[@data-table-header-id='id']");
    this.orderDateHeader = page.locator(
      "//th[@data-table-header-id='created_at']"
    );
    this.orderStatusHeader = page.locator(
      "//th[@data-table-header-id='status']"
    );
    this.coordinatorHeader = page.locator(
      "//th[@data-table-header-id='coordinator']"
    );
    this.programNameHeader = page.locator(
      "//th[@data-table-header-id='program_program_name']"
    );
    this.noOfPackagesHeader = page.locator(
      "//th[@data-table-header-id='package_order_packages']"
    );
    this.guestsHeader = page.locator(
      "//th[@data-table-header-id='order_total_guests']"
    );
    this.orderTotalHeader = page.locator(
      "//th[@data-table-header-id='order_total']"
    );
    this.approvingManagerHeader = page.locator(
      "//th[@data-table-header-id='approving_manager']"
    );
    this.orderIdColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[1]"
    );
    this.orderDateColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[2]"
    );
    this.orderStatusColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[3]"
    );
    this.coordinatorColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[4]"
    );
    this.programNameColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[5]"
    );
    this.noOfPackagesColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[6]"
    );
    this.guestsColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[7]"
    );
    this.orderTotalColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[8]"
    );
    this.approvingManagerColumnDataList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[9]"
    );
    this.actionColumnList = page.locator(
      "//tbody[@class='border-ui-border-base border-b-0']//tr//td[10]"
    );
    this.orderDetailsSection = page.locator(
      "//div[@aria-label='Order Details Tabs and Content']"
    );
    this.approveOrderButton = page.locator("//span[text()='Approve Order']");
    this.cancelOrderButton = page.locator("//span[text()='Cancel Order']");
    this.denyOrderButton = page.locator("//span[text()='Deny Order']");
    this.editOrderButton = page.locator("//span[text()='Edit Order']");
    this.nextButton = page.locator("//button[text()='Next']");
    this.orderAppoveSuccessMessage = page.locator(
      "//span[text()='Order has been approved successfully.']"
    );
  }

  async validateOrderDateColumnWithSpecificFormat(): Promise<
    { isValidFormat: boolean }[]
  > {
    const elements = await this.orderDateColumnDataList.all();
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/; // MM-DD-YY format
    const results: { isValidFormat: boolean }[] = [];

    for (const element of elements) {
      const textContent = await element.textContent();
      const trimmedText = textContent?.trim() || "";

      // Add the validation result to the results array
      results.push({
        isValidFormat: dateRegex.test(trimmedText),
      });
    }
    return results;
  }

  async validateNoOfPackagesColumnData(): Promise<{ isDigit: boolean }[]> {
    const elements = await this.noOfPackagesColumnDataList.all();
    const digitRegex = /^\d+$/; // Regex to match only digits
    const results: { isDigit: boolean }[] = [];

    for (const element of elements) {
      const textContent = await element.textContent();
      const trimmedText = textContent?.trim() || "";

      // Add the validation result to the results array
      results.push({
        isDigit: digitRegex.test(trimmedText),
      });
    }
    return results;
  }

  async openActionSheetForGivenStatus(status: string): Promise<string> {
    let isStatusFound = false;
    let orderId: string | null = null;

    // Loop to traverse across pages
    while (!isStatusFound) {
      const rows = await this.orderStatusColumnDataList.all(); // Get all rows in the status column

      // Loop through the current page's rows
      for (let i = 0; i < rows.length; i++) {
        const statusText = await rows[i].textContent(); // Get text of status in the row
        const trimmedStatusText = statusText?.trim() || "";

        // If the status matches the provided value, click the corresponding menu button
        if (trimmedStatusText === status) {
          const menuButton = this.actionColumnList.nth(i); // Get the menu button in the same row
          await menuButton.click(); // Click on the menu button

          // Fetch the Order ID from the same row (assuming it's in the first column)
          orderId = await this.orderIdColumnDataList.nth(i).textContent();

          isStatusFound = true; // Set the flag to true to exit the loop
          break; // Exit the row loop once a match is found and the menu button is clicked
        }
      }

      // If status is not found on the current page, check if the next button is enabled
      if (!isStatusFound) {
        const isNextButtonEnabled = await this.nextButton.isEnabled(); // Check if the next button is enabled
        if (isNextButtonEnabled) {
          await this.nextButton.click(); // Click the next button to go to the next page
          await this.page.waitForTimeout(1000); // Optionally, wait for the next page to load
        } else {
          console.log("Status not found on any page.");
          break; // Exit the loop if there are no more pages
        }
      }
    }
    // Ensure Order ID is a string, throw an error if null
    if (orderId === null) {
      throw new Error(`Order ID not found.`);
    }
    return orderId; // Return the Order ID after status match, or null if not found
  }

  async getOrderStatusById(orderId: string): Promise<string> {
    const orderIdValue = orderId.split("#")[1];
    const status = await this.getElementText(
      this.page.locator(
        `//span[text()='${orderIdValue}']/ancestor::td/following-sibling::td[2]`
      )
    );
    return status;
  }
}
