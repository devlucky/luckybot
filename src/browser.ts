import puppeteer, { ElementHandle } from 'puppeteer';
import { Page, Browser as PuppeteerBrowser } from 'puppeteer';
import { sleep } from './util/sleep';
import { LikeOptions } from './luckybot';

const host = 'https://www.instagram.com';

export interface BrowserOptions {
  debug?: boolean;
}

export class Browser {
  browser?: PuppeteerBrowser;
  page?: Page;
  isLoggedIn: boolean = false;
  options: BrowserOptions;

  constructor(options?: BrowserOptions) {
    this.options = options || {debug: false};
  }

  async createPage() {
    const browser = await puppeteer.launch({ headless: !this.options.debug });
    const page = await browser.newPage();
    const userAgent = await browser.userAgent();
    await page.setViewport({width: 1024, height: 768});
    await page.setUserAgent(userAgent.replace('Headless', ''));
    
    this.browser = browser;
    this.page = page;

    return page;
  }

  getPage(): Promise<Page> {
    const {page} = this;

    if (page) return Promise.resolve(page);

    return this.createPage();
  }

  async login(userName: string, password: string) {
    if (this.isLoggedIn) return;

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

    this.isLoggedIn = true;
  }

  async getPhotos(hashtag: string) {
    const page = await this.getPage();

    await page.goto(`${host}/explore/tags/${hashtag}/`);
    const article = await page.waitForSelector('article');
    const photos = await article.$$('a');
    
    return photos;
  }

  async esc() {
    const page = await this.getPage();
    await sleep(1000);
    await page.keyboard.press('Escape');
    await sleep(1000);
  }

  async closePhotoDetail() {
    const page = await this.getPage();
    await sleep(1000);
    // TODO: make generic + move somewhere else
    const closeButtonClassName = await page.evaluate(() => {
      const closeButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Close');
      return closeButton && closeButton.className;
    });

    if (closeButtonClassName) {
      const closeButton = await page.$(`.${closeButtonClassName}`);
      closeButton && closeButton.click();
    }

    await sleep(1000);
  }

  // TODO: return boolean liked?
  async likePhoto(photo: ElementHandle<Element>, delay: number): Promise<void> {
    const page = await this.getPage();

    await sleep(delay);
    await photo.click();
    await sleep();
    const photoId = page.url().replace(host, '');
    console.log('likePhoto', photoId)
    await sleep();
    try {
      const unlikeButton = await page.$('[aria-label="Unlike"]');
      if (unlikeButton) {
        console.log('photo already liked')
        await this.closePhotoDetail();
        return;
      }

      await sleep();
      const likeButton = await page.$('[aria-label="Like"]');
      if (likeButton) {
        await likeButton.click();
      }
      
      await this.closePhotoDetail();
      console.log('photo liked')
    } catch (e) {
      await this.closePhotoDetail();
      console.log('error liking photo', e)
    }
    await this.closePhotoDetail();
  }

  async likePhotos(hashtag: string, options?: LikeOptions) {
    const photos = (await this.getPhotos(hashtag)).reverse();
    const maxLikes = options ? options.maxLikes : Infinity;
    console.log('photos length', photos.length, maxLikes)
    const likedPhotos = photos.slice(0, maxLikes).map((photo, index) => {
      return this.likePhoto(photo, index * 15000);
    });

    await Promise.all(likedPhotos);
  }

  async close() {
    (await this.getPage()).close();
    this.browser && this.browser.close();
  }
};