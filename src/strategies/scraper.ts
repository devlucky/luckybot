import { ElementHandle } from 'puppeteer';
import { sleep } from '../util/sleep';
import { LikeOptions } from '../luckybot';
import { PageProvider } from '../page'
import { HOST } from '../config';
import { Session } from '../session';

export interface ScraperOptions {
  debug?: boolean; 
}

export class Scraper {
  isLoggedIn: boolean = false;
  pageProvider: PageProvider;
  session: Session;
  options: ScraperOptions;

  constructor(options: ScraperOptions = {}) {
    this.options = options;
    this.pageProvider = new PageProvider(options);
    this.session = new Session(options);
  }

  async login(userName: string, password: string) {
    const cookies = await this.session.login(userName, password);
    const page = await this.pageProvider.getPage();

    await page.setCookie(...cookies)
  }

  private async getPhotos(hashtag: string) {
    const page = await this.pageProvider.getPage();

    await page.goto(`${HOST}/explore/tags/${hashtag}/`);
    const article = await page.waitForSelector('article');
    const photos = await article.$$('a');
    
    return photos;
  }

  private async closePhotoDetail() {
    const page = await this.pageProvider.getPage();
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
  private async likePhoto(photo: ElementHandle<Element>, delay: number): Promise<void> {
    const page = await this.pageProvider.getPage();

    await sleep(delay);
    await photo.click();
    await sleep();
    const photoId = page.url().replace(HOST, '');
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
    await this.pageProvider.close();
  }
};