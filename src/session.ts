import { Page, Cookie } from "puppeteer";
import { HOST } from "./config";
import { PageProvider } from "./page";

export class Session {
  isLoggedIn: boolean = false;
  pageProvider: PageProvider;
  page?: Page;

  constructor() {
    this.pageProvider = new PageProvider();
  }

  async login(userName: string, password: string): Promise<Cookie[]> {
    const page = await this.pageProvider.getPage();

    if (this.isLoggedIn) {
      return page.cookies();
    };

    await page.goto(`${HOST}/accounts/login`);

    const userInput = await page.waitForSelector('input._2hvTZ');
    const passInput = await page.waitForSelector('input[type=password]');
    const logInButton = await page.waitForSelector('button[type="submit"]');

    if (!userInput || !passInput || !logInButton) {
      throw new Error('Error loging');
    }

    await userInput.type(userName);
    await passInput.type(password);
    await logInButton.click()
    await page.waitForNavigation();

    const cookies = await page.cookies();

    this.isLoggedIn = true;
    return cookies;
  }

}