import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import createAccountData from "../data/createAccountData.json";

export class createAccountPage extends BasePage {
  public signUpButton: Locator;
  public firstNameInput: Locator;
  public lastNameInput: Locator;
  public emailInput: Locator;
  public passwordInput: Locator;
  public confirmPasswordInput: Locator;
  public countryDropdown: Locator;
  public stateInput: Locator;
  public cityInput: Locator;
  public firstNameValidationMessage: Locator;
  public lastNameValidationMessage: Locator;
  public passwordFormatValidationMessage: Locator;
  public confirmPasswordValidationMessage: Locator;
  public cityValidationMessage: Locator;
  public stateValidationMessage: Locator;
  public countryValidationMessage: Locator;
  public locationValidationMessage: Locator;
  public shopUILogo: Locator;
  public createAccountSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.signUpButton = page.locator("//button[text()='Sign Up']");
    this.firstNameInput = page.locator("//input[@name='firstname']");
    this.lastNameInput = page.locator("//input[@name='lastname']");
    this.emailInput = page.locator("//input[@name='email']");
    this.passwordInput = page.locator("//input[@name='password']");
    this.confirmPasswordInput = page.locator(
      "//input[@name='confirm_password']"
    );
    this.stateInput = page.locator("//input[@name='state']");
    this.cityInput = page.locator("//input[@name='city']");
    this.countryDropdown = page.locator(
      "//form[@class='flex w-full flex-col gap-y-10']/descendant::select[2]"
    );
    this.firstNameValidationMessage = page.locator(
      "//span[text()='First name is required']"
    );
    this.lastNameValidationMessage = page.locator(
      "//span[text()='Last name is required']"
    );
    this.passwordFormatValidationMessage = page.locator(
      "//span[text()='Password: 8+ chars, upper, lower, number, symbol.']"
    );
    this.confirmPasswordValidationMessage = page.locator(
      "//span[text()='Please check your password and try again.']"
    );
    this.countryValidationMessage = page.locator(
      "//span[text()='Country is required']"
    );
    this.stateValidationMessage = page.locator(
      "//span[text()='State is required']"
    );
    this.cityValidationMessage = page.locator(
      "//span[text()='City is required']"
    );
    this.locationValidationMessage = page.locator(
      "//span[text()='City, state, and country must all be provided if any one is provided.']"
    );
    this.shopUILogo = page.locator(
      "//a[@class='flex items-center gap-4 md:gap-6']"
    );
    this.createAccountSuccessMessage = page.locator(
      "//span[text()='Create account successfully']"
    );
  }

  async createAccount(email: string): Promise<void> {
    const username = email.split("@")[0];
    const firstname = username.split("_")[0];
    const lastname = username.split("_").slice(1).join("_");
    await this.enterValuesInElement(this.firstNameInput, firstname);
    await this.enterValuesInElement(this.lastNameInput, lastname);
    await this.enterValuesInElement(
      this.passwordInput,
      createAccountData.password
    );
    await this.enterValuesInElement(
      this.confirmPasswordInput,
      createAccountData.password
    );
    await this.clickOnRandomOptionFromDropdown(this.countryDropdown);

    type CountryKeys = keyof typeof createAccountData;
    const selectedCountry = (await this.countryDropdown
      .locator("option:checked")
      .textContent()) as CountryKeys;
    const countryData = createAccountData[selectedCountry];
    await this.cityInput.waitFor();
    if (typeof countryData === "object" && countryData !== null) {
      await this.enterValuesInElement(this.cityInput, countryData.cityName);
      await this.enterValuesInElement(this.stateInput, countryData.stateName);
    } else {
      throw new Error(`Invalid data for country: ${selectedCountry}`);
    }
    await this.clickElement(this.signUpButton);
  }
}
