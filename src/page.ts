import puppeteer, { Browser, Page } from 'puppeteer';
import { DEBUG } from './config';

export class PageProvider {
  // those need to be static since we don't want to have multiple pages at the same time
  static page?: Page;
  static browser?: Browser;
  
  private async createPage() {
    const browser = await puppeteer.launch({ headless: !DEBUG });
    const page = await browser.newPage();
    const userAgent = await browser.userAgent();

    await page.setViewport({width: 1024, height: 768});
    await page.setUserAgent(userAgent.replace('Headless', ''));
    
    PageProvider.browser = browser;
    PageProvider.page = page;

    return page;
  }

  getPage(): Promise<Page> {
    const {page} = PageProvider;

    if (page) return Promise.resolve(page);

    return this.createPage();
  }

  async close() {
    const {page, browser} = PageProvider;
    
    page && await page.close()
    browser && await browser.close()
  }
}