import { Scraper } from "./strategies/scraper";
import { RestApi } from "./strategies/api";

export interface LikeOptions {
  maxLikes?: number
}

export interface Strategy {
  login(userName: string, password: string): Promise<void>
  likePhotos(hashtag: string, options?: LikeOptions): Promise<void>
  close(): Promise<void>
}

export enum StrategyType {
  PrivateAPIs = 0,
  Scraping = 1,
}

export class LuckyBot {
  userName: string
  password: string
  strategy: Strategy

  constructor(userName: string, password: string, strategyType: StrategyType = StrategyType.Scraping) {
    this.userName = userName
    this.password = password
    this.strategy = (function(strategyType) {  
      switch(strategyType) {
        case StrategyType.PrivateAPIs:
          return new RestApi()
        case StrategyType.Scraping:
          return new Scraper()
      }
    })(strategyType)
  }
  
  async login(): Promise<void> {
    const {strategy, userName, password} = this
    await strategy.login(userName, password)
  }

  async likePhotos(hashtag: string, options: LikeOptions = {maxLikes: 50}) {
    await this.strategy.likePhotos(hashtag, options)
  }

  async close() {
    await this.strategy.close()
  }
}