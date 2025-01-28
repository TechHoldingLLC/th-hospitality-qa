import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteProductPage extends BasePage {
  public searchInput: Locator;
  public menuButton: Locator;
  public deleteButton: Locator;
  public deleteProductButton: Locator;
  public deleteConfirmationMessageLabel: Locator;
  public confirmationButton: Locator;
  public alertDialog: Locator;
  public cancelProductButton: Locator;
  public menuButtonWithNonZeroIndex: Locator;
  public failedToDeleteProductLabel: Locator;
  public nextButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('//input[@placeholder="Search"]');
    this.menuButton = page.locator('td div button[aria-haspopup="menu"]');
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.deleteProductButton = page.getByRole("button", { name: "Delete" });
    this.deleteConfirmationMessageLabel = page.locator(
      "//label[contains(text(), 'This will permanently delete')]"
    );
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.alertDialog = page.getByRole("alertdialog");
    this.cancelProductButton = page.getByRole("button", { name: "Cancel" });
    this.menuButtonWithNonZeroIndex = page.locator(
      '//tr[td[6] > 0]//button[@aria-haspopup="menu"]'
    );
    this.failedToDeleteProductLabel = page.getByText(
      "Failed to delete product"
    );
    this.nextButton = page.locator(
      '//button[contains(text(), "Next") and @disabled]'
    );
  }

  async menuButtonByProductName(productName: string): Promise<Locator> {
    return this.page.locator(
      `//tr[td[normalize-space() = '${productName}']]//button[@aria-haspopup="menu"]`
    );
  }

  async getProductName(productName: string): Promise<Locator> {
    return this.page.locator(`//span[text()='${productName}']`);
  }

  async getDeleteConfirmationLocator(productName: string): Promise<Locator> {
    return this.page.locator(
      `//label[contains(text(), 'This will permanently delete the product "${productName}" and cannot be undone.')]`
    );
  }

  async getDeleteSuccessLocator(productName: string): Promise<Locator> {
    return this.page.locator(
      `//label[contains(text(), '${productName} was successfully deleted.')]`
    );
  }

  async getNoResultsMessageLocator(): Promise<Locator> {
    return this.page.locator('//p[contains(text(), "No results")]');
  }

  async openDeletePopupByProductName(productName: string): Promise<void> {
    await this.clickElement(await this.menuButtonByProductName(productName));
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteProductButton);
  }

  async openDeletePopupRandomly(): Promise<void> {
    await this.selectRandomItemFromMultiSelectList(this.menuButton);
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteProductButton);
  }

  async deleteReferredProduct(): Promise<void> {
    await this.selectRandomItemFromMultiSelectList(
      this.menuButtonWithNonZeroIndex
    );
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deleteProductButton);
  }

  async getFailedMessageLocator(): Promise<Locator> {
    return this.page.locator(
      '//label[contains(text(), "An error occurred while deleted product.")]'
    );
  }
}
