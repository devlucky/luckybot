import InstagramClient from 'instagram-private-api';
import {existsSync} from 'fs';
import { Strategy, LikeOptions, Media } from "./strategy";
import { sleep } from '../util/sleep';

const Client = InstagramClient.V1;

export class RestApi implements Strategy {
  session?: Object;

  constructor() {

  }

  async login(userName: string, password: string): Promise<Object> {
    const device = new Client.Device(userName);
    const cookiePath = `${__dirname}/${userName}.json`
    console.log('login: exist cookie', existsSync(cookiePath))
    const storage = new Client.CookieFileStorage(cookiePath);
    const session: Object = await Client.Session.create(device, storage, userName, password)

    this.session = session;

    return session;
  }

  async search(hashtag: string): Promise<Media[]> {
    const {session} = this;
    const taggedMedia = new Client.Feed.TaggedMedia(session, hashtag);
    const results = await taggedMedia.get();

    return results.map((result: any) => ({
      id: result.id,
      webLink: result._params.webLink
    }))
  };

  async likeMedias(hashtag: string, options: LikeOptions = {maxLikes: 20}): Promise<Media[]> {
    const {maxLikes} = options;
    const results = await this.search(hashtag);
    console.log('likeMedias', {hashtag, length: results.length, maxLikes})
    const likeMediaPromises = results.slice(0, maxLikes).map((media, index) => {
      return this.likeMedia(media, index * 15000);
    });

    const likedMedia = await Promise.all(likeMediaPromises);

    return likedMedia;
  };

  async likeMedia(media: Media, delay: number): Promise<Media> {
    try {
      await sleep(delay);
      console.log('likeMedia', media.id, media.webLink);
      await Client.Like.create(this.session, media.id);
      return media;
    } catch (e) {
      console.log('error liking media', media)
      return media;
    }
  }

  async close() {

  }
}