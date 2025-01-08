import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeleteProgramPage extends BasePage {
  public menuButtons: Locator;
  public deleteButton: Locator;
  public alertDialog: Locator;
  public deleteMessageLabel: Locator;
  public deleteProgramButton: Locator;
  public cancelProgramButton: Locator;
  public closePopupButton: Locator;
  public conformationButton: Locator;
  public searchInput: Locator;
  public rowValues: Locator;
  public failedToDeleteProgramLabel: Locator;
  public programInputText: Locator;
  public noResultsMessageContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButtons = page.locator(
      "(//a//button[@type='button' and @data-state='closed'])"
    );
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.deleteProgramButton = page.getByRole("button", { name: "Delete" });
    this.cancelProgramButton = page.getByRole("button", { name: "Cancel" });
    this.conformationButton = page.getByRole("button", {
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
    this.searchInput = page.locator("//input[@type='search']");
    this.rowValues = page.locator(
      '//*[@class="truncate text-black font-normal"]'
    );
    this.noResultsMessageContainer = page.locator(
      ".flex.flex-col.items-center.gap-y-2"
    );
  }

  async getDeleteConfirmationMessage(): Promise<string> {
    return (await this.deleteMessageLabel.textContent()) || "";
  }

  async deleteProgram(): Promise<void> {
    await this.deleteProgramButton.click();
    await this.conformationButton.waitFor({ state: "visible", timeout: 5000 });
  }

  async getDeleteSuccessMessage(): Promise<string> {
    return (await this.deleteMessageLabel.first().textContent()) || "";
  }

  async clickConformDelete(): Promise<void> {
    await this.conformationButton.click();
  }

  async searchProgramByName(programName: string): Promise<void> {
    await this.searchInput.fill("");
    await this.searchInput.fill(programName);
    await this.searchInput.press("Enter");
    await this.page.waitForTimeout(3000);
  }

  async validateProgramInputTextVisibility(): Promise<boolean> {
    const isVisible = await this.programInputText.isVisible();
    return isVisible;
  }

  async getNoResultsMessage(): Promise<string> {
    await this.noResultsMessageContainer.waitFor({ state: "visible" });

    if (await this.noResultsMessageContainer.isVisible()) {
      const message = await this.noResultsMessageContainer.textContent();
      if (message) {
        return message.trim();
      }
    }

    return "";
  }

  async openDeletePopup(): Promise<void> {
    await this.menuButtons.first().click();
    await this.deleteButton.click();
    await this.deleteProgramButton.waitFor({ state: "visible" });
  }

  async cancelDeleteProgramWithValidation(
    cancelType: "button" | "logo"
  ): Promise<void> {
    await this.openDeletePopup();
    expect(await this.isElementVisible(this.alertDialog)).toBe(true);

    if (cancelType === "button") {
      await this.cancelProgramButton.click();
    } else if (cancelType === "logo") {
      await this.closePopupButton.click();
    }
    await this.page.waitForTimeout(2000);
    expect(await this.alertDialog.isHidden()).toBe(true);
  }

  async getReferredProgramRow(): Promise<number[]> {
    await this.rowValues.first().waitFor({ state: "visible" });
    const allTextContents = await this.rowValues.allTextContents();
    const numericValues = allTextContents
      .map((text) => text.trim())
      .filter((text) => /^\d+$/.test(text))
      .map(Number);
    console.log("Program are referred:", numericValues);
    return numericValues;
  }

  async clickMenuButtonForNumericRow(): Promise<void> {
    const allRows = await this.rowValues.elementHandles();
    for (let i = 0; i < allRows.length; i++) {
      const text = await allRows[i].textContent();
      if (text && /^\d+$/.test(text.trim())) {
        const menuButton = await this.menuButtons.nth(i);
        await menuButton.click();
        console.log(`Clicked menu button for row with value: ${text.trim()}`);
        break;
      }
    }
  }

  async deleteSelectedProgramFromMenu(): Promise<void> {
    await this.deleteButton.click();
    await this.deleteProgramButton.click();
    await this.failedToDeleteProgramLabel.waitFor({ state: "visible" });
  }

  async getAlertMessage(): Promise<string | null> {
    const message = await this.alertDialog.textContent();
    return message ? message.trim() : null;
  }
}
