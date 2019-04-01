import { Scraper } from "./strategies/scraper";
import { Strategy } from "./strategies/strategy";
import { RestApi } from "./strategies/api";

export interface LuckyBotOptions {
  debug?: boolean;
}

export interface LikeOptions {
  maxLikes?: number;
}

export class LuckyBot {
  userName: string;
  password: string;
  client: Strategy;
  options: LuckyBotOptions;

  constructor(userName: string, password: string, options: LuckyBotOptions = {}) {
    this.userName = userName;
    this.password = password;
    this.options = options;
    // this.client = new Scraper(options);
    this.client = new RestApi();
  }
  
  async login(): Promise<void> {
    const {client, userName, password} = this;
    await client.login(userName, password);
  }

  async likePhotos(hashtag: string, options: LikeOptions = {maxLikes: 50}) {
    await this.client.likePhotos(hashtag, options);
  }

  async close() {
    await this.client.close();
  }
}