import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminEventCreationWizardpage } from "../pageObjects/adminEventCreationWizard";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import deleteEventData from "../data/deleteEventData.json";
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
    // Create Event
    const eventName = await basePage.generateNomenclatureName("Event");
    await basePage.clickElement(eventCreationWizardPage.addEventButton);
    await eventCreationWizardPage.createEvent(eventName);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventDraftSuccessMessage
      )
    ).toBe(true);

    // search and validate created event.
    await basePage.enterValuesInElement(deleteEventPage.searchInput, eventName);
    await basePage.waitForElementVisible(
      await deleteEventPage.menuButtonByEventName(eventName)
    );
    expect(
      await basePage.getElementText(deleteEventPage.eventInputText.first())
    ).toEqual(eventName);

    // Validate delete event confirmation.
    await deleteEventPage.openDeletePopup();
    expect(
      await basePage.getElementText(deleteEventPage.deleteMessageLabel)
    ).toEqual(
      `${deleteEventData.expectedDeleteConfirmationMessage} "${eventName}" ${deleteEventData.deleteConfirmationSuffix}`
    );

    // Validate event delete success message.
    await basePage.clickElement(deleteEventPage.deleteEventButton);
    await basePage.waitForElementVisible(
      deleteEventPage.eventDeleteSuccessLabel
    );
    expect(
      await basePage.getElementText(deleteEventPage.deleteMessageLabel.last())
    ).toEqual(`${eventName} ${deleteEventData.expectedDeleteSuccessMessage}`);

    // Validate and delete event successfully.
    await basePage.clickElement(deleteEventPage.confirmationButton);
    expect(
      await basePage.getElementText(deleteEventPage.noResultsMessageContainer)
    ).toContain(deleteEventData.expectedErrorMessages);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0084 - Verify that if the events is not associated with packages, products and orders a confirmation prompt appears.", async () => {
  try {
    const verifyAlertDialogVisibleAndHidden = async () => {
      expect(await basePage.isElementVisible(deleteEventPage.alertDialog)).toBe(
        true
      );
      expect(
        await basePage.getElementText(deleteEventPage.deleteMessageLabel)
      ).toContain(deleteEventData.expectedDeleteConfirmationMessage);
      await basePage.clickElement(deleteEventPage.cancelEventButton);
      await basePage.waitForElementHidden(deleteEventPage.alertDialog);
      expect(await deleteEventPage.alertDialog.isHidden()).toBe(true);
    };

    // Open delete popup and verify alert dialog behavior
    await deleteEventPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();

    // Open delete popup again and verify alert dialog behavior
    await deleteEventPage.openDeletePopup();
    await verifyAlertDialogVisibleAndHidden();
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0085 - verify that if the events is associated with packages, products and orders an error message appears.", async () => {
  try {
    await deleteEventPage.deleteReferredEvent();
    expect(
      await basePage.isElementVisible(deleteEventPage.failedToDeleteEventLabel)
    ).toBe(true);

    expect(
      await basePage.getElementText(deleteEventPage.alertDialog)
    ).not.toBeNull();

    expect(
      await basePage.getAllTextContents(deleteEventPage.alertDialog)
    ).toContain(deleteEventData.failedMessage);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
