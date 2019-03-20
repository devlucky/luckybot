import { Browser } from "./browser";

export interface BotOptions {
  
} 

export interface LikeOptions {
  maxLikes?: number;
}

export class LuckyBot {
  userName: string;
  password: string;
  browser: Browser;

  constructor(userName: string, password: string, options?: BotOptions) {
    this.userName = userName;
    this.password = password;
    this.browser = new Browser();
  }
  
  async like(hashtag: string, options?: LikeOptions): Promise<void> {

  }

  async login(): Promise<void> {
    const {browser, userName, password} = this;
    await browser.login(userName, password);
  }

  async getPhotos(hashtag: string) {
    const {browser} = this;
    await browser.getPhotos(hashtag);
  }
}