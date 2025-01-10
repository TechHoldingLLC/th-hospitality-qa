import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteProgramPage extends BasePage {
  public menuButtons: Locator;
  public deleteButton: Locator;
  public alertDialog: Locator;
  public deleteMessageLabel: Locator;
  public deleteProgramButton: Locator;
  public cancelProgramButton: Locator;
  public closePopupButton: Locator;
  public confirmationButton: Locator;
  public searchInput: Locator;
  public rowValues: Locator;
  public failedToDeleteProgramLabel: Locator;
  public programInputText: Locator;
  public noResultsMessageContainer: Locator;
  public menuButtonWithLocationGreaterThanZero: Locator;
  public paginationStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButtons = page.locator(
      "(//a//button[@type='button' and @data-state='closed'])"
    );
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.deleteProgramButton = page.getByRole("button", { name: "Delete" });
    this.cancelProgramButton = page.getByRole("button", { name: "Cancel" });
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.failedToDeleteProgramLabel = page.getByText(
      "Failed to delete program"
    );
    this.programInputText = page.locator('[tabindex="0"]');
    this.alertDialog = page.getByRole("alertdialog");
    this.deleteMessageLabel = page.locator(
      "//p[contains(@class,'text-ui-fg-subtle')]/label[1]"
    );
    this.closePopupButton = page.locator(
      "//div[@role='alertdialog']//label[text()='Delete Program']/following-sibling::button"
    );
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.rowValues = page.locator(
      '//*[@class="truncate text-black font-normal"]'
    );
    this.noResultsMessageContainer = page.locator(
      ".flex.flex-col.items-center.gap-y-2"
    );
    this.menuButtonWithLocationGreaterThanZero = page.locator(
      '//tr[td[5] > 0 or td[6] > 0 or td[7] > 0 or td[8] > 0]//button[@aria-haspopup="menu"]'
    );
    this.paginationStatus = page.locator(
      '//p[normalize-space()="1 of 1 pages"]'
    );
  }

  async openDeletePopup(): Promise<void> {
    await this.clickElement(this.menuButtons.first());
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteProgramButton)
  }

  async deleteReferredProgram(): Promise<void> {
    await this.clickElement(this.menuButtonWithLocationGreaterThanZero.first());
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deleteProgramButton);
  }
}
