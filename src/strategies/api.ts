import { LikeOptions } from '../luckybot';
import * as rm from 'typed-rest-client/RestClient'

// TODO: xhr call to private rest api goes here

export class RestApi {
    private client: rm.RestClient = new rm.RestClient("Mozilla/5.0 (X11; U; Linux x86_64; de; rv:1.9.2.8) Gecko/20100723 Ubuntu/10.04 (lucid) Firefox/3.6.8", 'https://www.instagram.com')

    async login(userName: string, password: string) {
        await this.client.get("accounts/login/ajax/").then(response1 => {
            console.log(response1)
          })
          .catch(error => console.log(error))
    }

    async likePhotos(hashtag: string, options?: LikeOptions) {
        console.log(hashtag)
    }

    async close() {
        console.log("close")
    }
}