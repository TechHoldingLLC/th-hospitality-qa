import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminEventCreationWizardpage } from "../pageObjects/adminEventCreationWizard";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import { adminDeleteEventPage } from "../pageObjects/adminDeleteEvents";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let eventCreationWizardPage: adminEventCreationWizardpage;
let deleteEventPage: adminDeleteEventPage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  eventCreationWizardPage = new adminEventCreationWizardpage(page);
  deleteEventPage = new adminDeleteEventPage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(eventCreationWizardPage.eventsButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0083 - Verify that an admin can successfully delete an event that is not associated with programs, products, Packages.", async () => {
  try {
    // Create a event and validate its successful creation.
    const eventName = await basePage.generateNomenclatureName("Event");
    await basePage.clickElement(eventCreationWizardPage.addEventButton);
    await eventCreationWizardPage.createEvent(eventName);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventDraftSuccessMessage
      )
    ).toBe(true);

    await basePage.enterValuesInElement(deleteEventPage.searchInput, eventName);
    await deleteEventPage.openDeletePopupByEventName(eventName);
    expect(
      await basePage.isElementVisible(
        await deleteEventPage.getDeleteConfirmationLocator(eventName)
      )
    ).toBe(true);

    // Validate the success message after deleting the event.
    await basePage.clickElement(deleteEventPage.deleteEventButton);
    expect(
      await basePage.isElementVisible(
        await deleteEventPage.getDeleteSuccessLocator(eventName)
      )
    ).toBe(true);

    // Validate that the event has been successfully deleted.
    await basePage.clickElement(deleteEventPage.confirmationButton);
    expect(
      await basePage.isElementVisible(deleteEventPage.getNoResultsMessage)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0084 - Verify that if the event is not associated with orders a confirmation prompt appears", async () => {
  try {
    const verifyAlertDialogVisibleAndHidden = async () => {
      expect(await basePage.isElementVisible(deleteEventPage.alertDialog)).toBe(
        true
      );
      expect(
        await basePage.isElementVisible(
          deleteEventPage.deleteConfirmationMessageLabel
        )
      ).toBe(true);
      await basePage.clickElement(deleteEventPage.cancelEventButton);
      await basePage.waitForElementHidden(deleteEventPage.alertDialog);
      expect(await deleteEventPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deleteEventPage.openDeletePopupRandomly();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deleteEventPage.openDeletePopupRandomly();
    await verifyAlertDialogVisibleAndHidden();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0085 - Verify that if the event is associated with orders or package an error message appears", async () => {
  try {
    await deleteEventPage.deleteReferredEvent();
    expect(
      await basePage.isElementVisible(deleteEventPage.failedToDeleteEventLabel)
    ).toBe(true);
    expect(
      await basePage.getElementText(deleteEventPage.alertDialog)
    ).not.toBeNull();
    expect(
      await basePage.isElementVisible(deleteEventPage.getFailedMessage)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
