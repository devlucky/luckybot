export interface BotOptions {
  
} 

export interface LikeOptions {
  maxLikes?: number;
}

export class LuckyBot {
  constructor(userName: string, password: string, options?: BotOptions) {

  }
  
  async like(hashtag: string, options?: LikeOptions): Promise<void> {

  }
}