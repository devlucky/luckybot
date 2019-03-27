import { Scraper } from "./strategies/scraper";

export interface BotOptions {
  debug?: boolean;  
} 

export interface LikeOptions {
  maxLikes?: number;
}

export class LuckyBot {
  userName: string;
  password: string;
  scraper: Scraper;

  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
    this.scraper = new Scraper();
  }
  
  async login(): Promise<void> {
    const {scraper, userName, password} = this;
    await scraper.login(userName, password);
  }

  async likePhotos(hashtag: string, options: LikeOptions = {maxLikes: 50}) {
    await this.scraper.likePhotos(hashtag, options);
  }

  async close() {
    await this.scraper.close();
  }
}