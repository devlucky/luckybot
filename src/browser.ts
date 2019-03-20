import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

const host = 'https://www.instagram.com';

export class Browser {
  page?: Page;

  constructor() {
    
  }

  async createPage() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const userAgent = await browser.userAgent();
    await page.setViewport({width: 1024, height: 768});
    await page.setUserAgent(userAgent.replace('Headless', ''));
    
    this.page = page;

    return page;
  }

  getPage(): Promise<Page> {
    const {page} = this;

    if (page) return Promise.resolve(page);

    return this.createPage();
  }

  async login(userName: string, password: string) {
    const page = await this.getPage();

    await page.goto(`${host}/accounts/login`);

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
  }

  async getPhotos(hashtag: string) {
    const page = await this.getPage();

    await page.goto(`${host}/explore/tags/${hashtag}/`);
    const article = await page.waitForSelector('article');
    
    const photos = await article.$$('a')
    console.log('photos', photos.length)

    // TODO: start from bottom photos
    await photos[0].click();
    const likeButton = await page.waitForSelector('[aria-label="Like"]');

    await likeButton.click()
    await page.screenshot({path: 'debug.png'});
  }
};