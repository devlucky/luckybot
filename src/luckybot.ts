import { Browser } from "./browser";

export interface BotOptions {
  debug?: boolean;  
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
    this.browser = new Browser(options);
  }
  
  async login(): Promise<void> {
    const {browser, userName, password} = this;
    await browser.login(userName, password);
  }

  async likePhotos(hashtag: string, options: LikeOptions = {maxLikes: 50}) {
    await this.browser.likePhotos(hashtag, options);
  }

  async close() {
    await this.browser.close();
  }
}