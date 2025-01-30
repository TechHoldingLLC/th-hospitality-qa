import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteEventPage extends BasePage {
  public searchInput: Locator;
  public menuButtons: Locator;
  public deleteButton: Locator;
  public deleteEventButton: Locator;
  public confirmationButton: Locator;
  public alertDialog: Locator;
  public cancelEventButton: Locator;
  public menuButtonWithNonZeroIndex: Locator;
  public failedToDeleteEventLabel: Locator;
  public getNoResultsMessage: Locator;
  public deleteConfirmationMessageLabel: Locator;
  public getFailedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.menuButtons = page.locator('td div button[aria-haspopup="menu"]');
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.deleteEventButton = page.getByRole("button", { name: "Delete" });
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.alertDialog = page.getByRole("alertdialog");
    this.cancelEventButton = page.getByRole("button", { name: "Cancel" });
    this.failedToDeleteEventLabel = page.getByText("Failed to delete event");
    this.menuButtonWithNonZeroIndex = page.locator(
      '//tr[td[6] > 0]//button[@aria-haspopup="menu"]'
    );
    this.getNoResultsMessage = page.locator(
      '//p[contains(text(), "No results")]'
    );
    this.deleteConfirmationMessageLabel = page.locator(
      "//label[contains(text(), 'This will permanently delete')]"
    );
    this.getFailedMessage = page.locator(
      '(//label[contains(text(),"This event can\'t be deleted because it is referenced by one or more ticket products.")])'
    );
  }

  async menuButtonByEventName(eventName: string): Promise<Locator> {
    return this.page.locator(
      `//tr[td//span[contains(@title, '${eventName}')]]//button[@aria-haspopup="menu"]`
    );
  }

  async getDeleteConfirmationLocator(eventName: string): Promise<Locator> {
    return this.page.locator(
      `//label[contains(text(), 'This will permanently delete the event "${eventName}" and cannot be undone.')]`
    );
  }

  async getDeleteSuccessLocator(eventName: string): Promise<Locator> {
    return this.page.locator(
      `//label[contains(text(), '${eventName} was successfully deleted.')]`
    );
  }

  async openDeletePopupByEventName(eventName: string): Promise<void> {
    await this.clickElement(await this.menuButtonByEventName(eventName));
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteEventButton);
  }

  async openDeletePopupRandomly(): Promise<void> {
    await this.selectRandomItemFromMultiSelectList(this.menuButtons);
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deleteEventButton);
  }

  async deleteReferredEvent(): Promise<void> {
    await this.selectRandomItemFromMultiSelectList(
      this.menuButtonWithNonZeroIndex
    );
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deleteEventButton);
  }
}
