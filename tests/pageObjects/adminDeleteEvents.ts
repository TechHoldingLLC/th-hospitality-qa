import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteEventPage extends BasePage {
  public searchInput: Locator;
  public eventInputText: Locator;
  public menuButtons: Locator;
  public deleteButton: Locator;
  public deleteEventButton: Locator;
  public deleteMessageLabel: Locator;
  public eventDeleteSuccessLabel: Locator;
  public confirmationButton: Locator;
  public noResultsMessageContainer: Locator;
  public alertDialog: Locator;
  public cancelEventButton: Locator;
  public menuButtonWithLocationGreaterThanZero: Locator;
  public failedToDeleteEventLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.eventInputText = page.locator("//td//span[text()]");
    this.menuButtons = page.locator('td div button[aria-haspopup="menu"]');
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.deleteEventButton = page.getByRole("button", { name: "Delete" });
    this.deleteMessageLabel = page.locator(
      "//p[contains(@class,'text-ui-fg-subtle')]/label[1]"
    );
    this.eventDeleteSuccessLabel = page.locator("label", {
      hasText: "Event deleted",
    });
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.noResultsMessageContainer = page.locator(
      ".flex.flex-col.items-center.gap-y-2"
    );
    this.alertDialog = page.getByRole("alertdialog");
    this.cancelEventButton = page.getByRole("button", { name: "Cancel" });
    this.failedToDeleteEventLabel = page.getByText("Failed to delete product");
    this.menuButtonWithLocationGreaterThanZero = page.locator(
      '//tr[td[6] > 0]//button[@aria-haspopup="menu"]'
    );
  }

  async menuButtonByEventName(eventName: string): Promise<Locator> {
    return this.page.locator(
      `//tr[td[normalize-space() = '${eventName}']]//button[@aria-haspopup="menu"]`
    );
  }

  async openDeletePopup(): Promise<void> {
    await this.clickElement(this.menuButtons.first());
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteEventButton);
  }

  async deleteReferredEvent(): Promise<void> {
    await this.clickElement(this.menuButtonWithLocationGreaterThanZero.first());
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deleteEventButton);
  }
}
