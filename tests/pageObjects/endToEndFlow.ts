import { Page } from "@playwright/test";
import BasePage from "./basePage";

export class endToEndFlow extends BasePage{

    constructor(page: Page){
        super(page);
    }
}