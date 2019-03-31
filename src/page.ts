import puppeteer, { Browser, Page } from 'puppeteer';

export interface PageProviderOptions {
  debug?: boolean;
}

export class PageProvider {
  options: PageProviderOptions;
  // those need to be static since we don't want to have multiple pages at the same time
  static page?: Page;
  static browser?: Browser;
  
  constructor(options?: PageProviderOptions) {
    this.options = options || {debug: false};
  }
  
  private async createPage() {
    const headless = !this.options.debug;
    console.log('createPage', {headless})
    const browser = await puppeteer.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const userAgent = await browser.userAgent();
    const newUserAgent = userAgent.replace('Headless', '');
    // const newUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36';
    console.log({newUserAgent})    
    await page.setViewport({width: 1024, height: 768});
    await page.setUserAgent(newUserAgent);
    
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
    
    page && !page.isClosed() && await page.close();
    browser && await browser.close()
  }
}