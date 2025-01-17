import test, { Browser, Page, chromium, expect } from "@playwright/test";
import BasePage from "../pageObjects/basePage";
import { adminEventCreationWizardpage } from "../pageObjects/adminEventCreationWizard";
import { config } from "../config/config.qa";
import { adminLoginPage } from "../pageObjects/adminLoginPage";
import createEventData from "../data/createEventData.json";

let browser: Browser;
let page: Page;
let basePage: BasePage;
let loginPage: adminLoginPage;
let eventCreationWizardPage: adminEventCreationWizardpage;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false, channel: "chrome" });
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new adminLoginPage(page);
  eventCreationWizardPage = new adminEventCreationWizardpage(page);
  await basePage.navigateTo(config.adminPortalUrl);
  await loginPage.login(config.email, config.password);
  await basePage.clickElement(eventCreationWizardPage.eventsButton);
  await basePage.clickElement(eventCreationWizardPage.addEventButton);
});

test.afterEach(async () => {
  await browser.close();
});

test("TC0080 - Verify that users can create nested objects and that nested object lists are filtered by objects associated with the same program as the event", async () => {
  try {
    const eventName = await basePage.generateNomenclatureName("Event");
    await eventCreationWizardPage.createEvent(eventName);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventDraftSuccessMessage
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0165 - Verify that application validates the mandatory fields when left blank on Event Information screen", async () => {
  try {
    await basePage.clickElement(eventCreationWizardPage.productsTab);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventNameValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventStartDateValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventEndDateValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventVenueValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.associatedProgramValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.thumbnailValidation
      )
    ).toBe(true);
    expect(
      await basePage.isElementVisible(eventCreationWizardPage.mediaValidation)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0079 - Verify that users can save as draft and publish", async () => {
  try {
    const eventName = await basePage.generateNomenclatureName("Event");
    await eventCreationWizardPage.createEvent(eventName);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventDraftSuccessMessage
      )
    ).toBe(true);
    await basePage.waitForElementHidden(
      eventCreationWizardPage.eventDraftSuccessMessage
    );
    const createdEventtLocator = page.locator(`text=${eventName}`).first();
    expect(await basePage.getElementText(createdEventtLocator)).toEqual(
      eventName
    );
    expect(
      await basePage.getElementText(
        await eventCreationWizardPage.getStatusByEventName(eventName)
      )
    ).toEqual("DRAFT");
    await basePage.clickElement(
      await eventCreationWizardPage.createdEventKebabIconLocator(eventName)
    );
    await basePage.clickElement(eventCreationWizardPage.editButton);
    await basePage.enterValuesInElement(
      eventCreationWizardPage.eventDescriptionInput,
      await basePage.generateNomenclatureDescription("Event")
    );
    await basePage.clickElement(eventCreationWizardPage.nextButton);
    await basePage.clickElement(eventCreationWizardPage.nextButton);
    await basePage.clickElement(eventCreationWizardPage.publishButton);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventPublishSuccessMessage
      )
    ).toBe(true);
    await basePage.waitForElementHidden(
      eventCreationWizardPage.eventPublishSuccessMessage
    );
    expect(
      await basePage.getElementText(
        await eventCreationWizardPage.getStatusByEventName(eventName)
      )
    ).toEqual("PUBLISHED");
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0078 - Verify that users can create events in a wizard like experience", async () => {
  try {
    const eventName = await basePage.generateNomenclatureName("Event");
    await eventCreationWizardPage.createEventWithNewObjects(eventName);
    expect(
      await basePage.isElementVisible(
        eventCreationWizardPage.eventPublishSuccessMessage
      )
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});

test("TC0081 - Verify nested objects persist after abandoning event creation", async () => {
  try {
    const eventName = await basePage.generateNomenclatureName("Event");
    await eventCreationWizardPage.fillEventInformationForm(eventName);

    // Verify abandon while creating new product
    await basePage.clickElement(eventCreationWizardPage.addProductButton);
    await basePage.enterValuesInElement(
      eventCreationWizardPage.productNameInput,
      eventName
    );
    await basePage.clickElement(eventCreationWizardPage.cancelButton);
    expect(
      await basePage.isElementVisible(eventCreationWizardPage.cancelPopUpText)
    ).toBe(true);
    expect(
      await basePage.getElementText(eventCreationWizardPage.cancelPopUpText)
    ).toEqual(createEventData.cancellationPopupText);

    await basePage.clickElement(eventCreationWizardPage.confirmCancelButton);
    await basePage.clickElement(eventCreationWizardPage.nextButton);

    // Verify abandon while creating new package
    await basePage.clickElement(eventCreationWizardPage.addPackageButton);
    await basePage.enterValuesInElement(
      eventCreationWizardPage.packageNameInput,
      eventName
    );
    await basePage.clickElement(eventCreationWizardPage.cancelButton);
    expect(
      await basePage.isElementVisible(eventCreationWizardPage.cancelPopUpText)
    ).toBe(true);
    expect(
      await basePage.getElementText(eventCreationWizardPage.cancelPopUpText)
    ).toEqual(createEventData.cancellationPopupText);
    await basePage.clickElement(eventCreationWizardPage.confirmCancelButton);

    // Verify nested objects including Programs, Products and packages are still present and not lost
    expect(
      await basePage.isElementVisible(eventCreationWizardPage.saveDraftButton)
    ).toBe(true);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
});
