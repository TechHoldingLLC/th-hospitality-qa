import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class adminDeletePackagesPage extends BasePage {
  public menuButton: Locator;
  public deleteButton: Locator;
  public alertDialog: Locator;
  public orderButton: Locator;
  public orderListLink: Locator;
  public packagesButton: Locator;
  public packageNameFromTable: Locator;
  public nextButton: Locator;
  public deleteMessageLabel: Locator;
  public packageDeleteSuccessLabel: Locator;
  public confirmationButton: Locator;
  public packageInputText: Locator;
  public cancelPackageButton: Locator;
  public deletePackageButton: Locator;
  public failedToDeletePackageLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('td div button[aria-haspopup="menu"]');
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.alertDialog = page.getByRole("alertdialog");
    this.orderButton = page.locator("//a[@href='/orders']");
    this.orderListLink = page.locator("//table//tr/td[1]//a");
    this.packagesButton = page.locator(
      "//div[@role='tablist']/button[text()='Packages']"
    );
    this.packageNameFromTable = page.locator(
      "//div[contains(@id,'package')]//table//tr/td[1]"
    );
    this.nextButton = page.locator("//button[text()='Next']");
    this.deleteMessageLabel = page.locator(
      "//p[contains(@class,'text-ui-fg-subtle')]/label[1]"
    );
    this.deletePackageButton = page.getByRole("button", { name: "Delete" });
    this.packageDeleteSuccessLabel = page.locator("label", {
      hasText: "Package deleted",
    });
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.packageInputText = page.locator("//td//a//span[text()]");
    this.cancelPackageButton = page.getByRole("button", { name: "Cancel" });
    this.deletePackageButton = page.getByRole("button", { name: "Delete" });
    this.failedToDeletePackageLabel = page.getByText(
      "Failed to delete package"
    );
  }

  async menuButtonByPackageName(packageName: string): Promise<Locator> {
    return this.page.locator(
      `//tr[td[1][normalize-space() = '${packageName}']]//button[@aria-haspopup="menu"]`
    );
  }

  async openDeletePopup(packageName?: string): Promise<void> {
    if (packageName) {
      await this.clickElement(await this.menuButtonByPackageName(packageName));
    } else {
      await this.clickElement(this.menuButton.first());
    }
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deletePackageButton);
  }

  async getPackageNameFromOrderPage(): Promise<string | null> {
    await this.waitForPageToBeReady();
    await this.clickElement(this.orderButton);
    await this.clickElement(this.orderListLink.last());
    await this.clickElement(this.packagesButton);
    await this.waitForElementVisible(this.packageNameFromTable.first());
    await this.clickElement(this.packageNameFromTable.first());
    return (
      await this.getAllTextContents(this.packageNameFromTable.first())
    ).join(" ");
  }

  async clickPackageMenuButton(packageName: string): Promise<void> {
    const packageLocator = this.page.locator(
      `//div[normalize-space()='${packageName}']/ancestor::td/following-sibling::td//button`
    );
    await this.page.waitForTimeout(2000);
    let packageFound = await packageLocator.isVisible();

    if (!packageFound) {
      let isNextEnabled = await this.nextButton.isEnabled();
      if (isNextEnabled) {
        await this.clickElement(this.nextButton);
        await this.waitForPageToBeReady();
        await this.clickPackageMenuButton(packageName);
      } else {
        console.error(`${packageName} not found on the page`);
      }
    } else {
      await this.clickElement(packageLocator);
      await this.waitForPageToBeReady();
    }
  }

  async attemptToDeletePackage(packageName: string): Promise<void> {
    await this.clickPackageMenuButton(packageName);
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deletePackageButton);
    await this.waitForElementVisible(this.failedToDeletePackageLabel);
  }
}
