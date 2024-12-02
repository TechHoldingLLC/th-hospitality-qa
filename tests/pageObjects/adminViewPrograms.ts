import { Locator, Page } from "@playwright/test";

export class adminViewProgramsPage {
    private page: Page;
    private programsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.programsButton = page.locator("//a[@href='/programs']");
    }
    async clickProgramsButton(): Promise<void> {
        await this.programsButton.click();
    }
}