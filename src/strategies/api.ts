import InstagramClient from 'instagram-private-api';
import { Strategy, LikeOptions } from "./strategy";

const Client = InstagramClient.V1;

export class RestApi implements Strategy {
  session?: any;

  constructor() {

  }

  async login(userName: string, password: string): Promise<void> {
    const device = new Client.Device(userName);
    const storage = new Client.CookieFileStorage(`${__dirname}/${userName}.json`);
    const session = await Client.Session.create(device, storage, userName, password)

    this.session = session;
  }

  async likePhotos(hashtag: string, options?: LikeOptions): Promise<void> {
    const {session} = this;
    const taggedMedia = new Client.Feed.TaggedMedia(session, hashtag);
    const results = await taggedMedia.get();
    const firstMedia = results[0];

    console.log('like', firstMedia.id);
    await Client.Like.create(session, firstMedia.id)
  };

  async close() {

  }
}