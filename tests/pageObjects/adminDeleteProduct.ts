import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteProductPage extends BasePage {
  public searchInput: Locator;
  public productInputText: Locator;
  public paginationStatus: Locator;
  public menuButton: Locator;
  public deleteButton: Locator;
  public deleteProductButton: Locator;
  public deleteMessageLabel: Locator;
  public confirmationButton: Locator;
  public noResultsMessageContainer: Locator;
  public deletedSuccessStatus: Locator;
  public alertDialog: Locator;
  public cancelProductButton: Locator;
  public menuButtonWithLocationGreaterThanZero: Locator;
  public failedToDeleteProductLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.productInputText = page.locator('[tabindex="0"]');
    this.paginationStatus = page.locator(
      '//p[normalize-space()="1 of 1 pages"]'
    );
    this.menuButton = page.locator(
      "(//a//button[@type='button' and @data-state='closed'])"
    );
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.deleteProductButton = page.getByRole("button", { name: "Delete" });
    this.deleteMessageLabel = page.locator(
      "//p[contains(@class,'text-ui-fg-subtle')]/label[1]"
    );
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.noResultsMessageContainer = page.locator(
      ".flex.flex-col.items-center.gap-y-2"
    );
    this.deletedSuccessStatus = page.locator(
      '//label[normalize-space()="Product deleted"]'
    );
    this.alertDialog = page.getByRole("alertdialog");
    this.cancelProductButton = page.getByRole("button", { name: "Cancel" });
    this.menuButtonWithLocationGreaterThanZero = page.locator(
      '//tr[td[6] > 0]//button[@aria-haspopup="menu"]'
    );
    this.failedToDeleteProductLabel = page.getByText(
      "Failed to delete product"
    );
  }

  async openDeletePopup(): Promise<void> {
    await this.clickElement(this.menuButton.first());
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteProductButton);
  }

  async deleteReferredProduct(): Promise<void> {
    await this.clickElement(this.menuButtonWithLocationGreaterThanZero.first());
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deleteProductButton);
  }
}
