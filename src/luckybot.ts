import { Strategy, MediaLocation, LikeFollowerOptions, User } from "./strategies/strategy";
import { RestApi } from "./strategies/api";

export interface LuckyBotOptions {
  debug?: boolean;
  cookiePath?: string;
  proxyUrl?: string;
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
    this.client = new RestApi(options);
  }
  
  async login(): Promise<void> {
    const {client, userName, password} = this;
    await client.login(userName, password);
  }

  async likePhotos(hashtag: string, options: LikeOptions = {maxLikes: 50}) {
    await this.client.likeTaggedMedias(hashtag, options);
  }

  async searchLocation(query: string) {
    return this.client.searchLocation(query);
  }

  async searchMediaByLocation(location: MediaLocation) {
    return this.client.searchMediaByLocation(location);
  }

  async getFollowers(accountId: string) {
    return this.client.getFollowers(accountId);
  }

  async likeFollowersPhotos(accountId: string, options: LikeFollowerOptions) {
    return this.client.likeFollowersPhotos(accountId, options);
  }

  async getUser(username: string): Promise<User> {
    return this.client.getUser(username);
  };

  async close() {
    await this.client.close();
  }
}