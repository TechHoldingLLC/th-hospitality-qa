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
  public confirmationButton: Locator;
  public packageDeleteSuccessLabel: Locator;
  public cancelPackageButton: Locator;
  public deletePackageButton: Locator;
  public failedToDeletePackageLabel: Locator;
  public orderPackagesButton: Locator;
  public getErrorMessageLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('td div button[aria-haspopup="menu"]');
    this.deleteButton = page.getByRole("menuitem", { name: "Delete" });
    this.alertDialog = page.getByRole("alertdialog");
    this.orderButton = page.locator("//a[@href='/orders']");
    this.orderListLink = page.locator("tbody tr");
    this.packagesButton = page.locator(
      "//div[@role='tablist']/button[text()='Packages']"
    );
    this.packageNameFromTable = page.locator(
      "tbody tr:nth-child(1) td:nth-child(1)"
    );
    this.nextButton = page.locator("//button[text()='Next']");
    this.deleteMessageLabel = page.locator("label.font-sans.text-center");
    this.packageDeleteSuccessLabel = page.locator(
      '//label[text()="Package deleted"]/following::label[1]'
    );
    this.deletePackageButton = page.getByRole("button", { name: "Delete" });
    this.confirmationButton = page.getByRole("button", {
      name: "Yeah, Thanks!",
    });
    this.cancelPackageButton = page.getByRole("button", { name: "Cancel" });
    this.deletePackageButton = page.getByRole("button", { name: "Delete" });
    this.failedToDeletePackageLabel = page.getByText(
      "Failed to delete package"
    );
    this.orderPackagesButton = page.locator("//a[@href='/packages']");
    this.getErrorMessageLocator = page.locator(
      '//label[text()="This package can\'t be deleted because it is referenced in one or more orders."]'
    );  }

  async menuButtonByPackageName(packageName: string): Promise<Locator> {
    return this.page.locator(
      `//tr[td[normalize-space() = '${packageName}']]//button[@aria-haspopup="menu"]`
    );
  }

  async getPackageName(packageName: string): Promise<Locator> {
    return this.page.locator(`//span[text()='${packageName}']`);
  }

  async getDeleteConfirmationLocator(packageName: string): Promise<Locator> {
    return this.page.locator(
      `//label[contains(text(), 'This will permanently delete the package "${packageName}" and cannot be undone.')]`
    );
  }

  async getDeleteSuccessLocator(packageName: string): Promise<Locator> {
    return this.page.locator(
      `//label[contains(text(), '${packageName} was successfully deleted.')]`
    );
  }

  async openDeletePopupByPackageName(packageName: string): Promise<void> {
    await this.clickElement(await this.menuButtonByPackageName(packageName));
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deletePackageButton);
  }

  async openDeletePopupRandomly(): Promise<void> {
    await this.selectRandomItemFromMultiSelectList(this.menuButton);
    await this.clickElement(this.deleteButton);
    await this.waitForElementVisible(this.deletePackageButton);
  }

  async getPackageNameFromOrderPage(): Promise<string | null> {
    await this.waitForPageToBeReady();
    await this.clickElement(this.orderButton);
    await this.selectRandomItemFromMultiSelectList(this.orderListLink);
    await this.clickElement(this.packagesButton);
    await this.clickElement(this.packageNameFromTable);
    const packageName = await this.getElementText(this.packageNameFromTable);
    await this.clickElement(this.orderPackagesButton);
    return packageName;
  }

  async clickPackageMenuButton(packageName: string | null): Promise<void> {
    while (packageName) {
      const packageButton = this.page.locator(
        `//div[normalize-space()='${packageName}']/ancestor::td/following-sibling::td//button`
      );
      if (await packageButton.isVisible()) {
        await this.clickElement(packageButton);
        await this.waitForPageToBeReady();
        break;
      }
      if (await this.nextButton.isEnabled()) {
        await this.clickElement(this.nextButton);
        await this.page.waitForTimeout(1000);
      } else {
        console.error(`${packageName} not found on the page.`);
        console.log("Fetching a new package name...");
        packageName = await this.getPackageNameFromOrderPage();
        if (!packageName) {
          console.error("No packages available to attempt selection.");
          break;
        }
      }
    }
  }

  async attemptToDeletePackage(packageName: string): Promise<void> {
    await this.clickPackageMenuButton(packageName);
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.deletePackageButton);
    await this.waitForElementVisible(this.failedToDeletePackageLabel);
  }
}
