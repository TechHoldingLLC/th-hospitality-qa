import { Locator, Page } from "@playwright/test";

export class adminDeletePackagesPage {
    private page: Page;
    public threeDotsButton: Locator;
    public deleteButton:Locator;

    constructor(page: Page) {
        this.page = page;
        this.threeDotsButton = page.locator("(//a//button[@type='button' and @data-state='closed'])[1]");
        this.deleteButton = page.locator("//*[@role='menuitem']//span[text()='Delete']");

    }

}
  