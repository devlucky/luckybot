import InstagramClient from 'instagram-private-api';
import { Strategy, LikeOptions } from "./strategy";
import { sleep } from '../util/sleep';

const Client = InstagramClient.V1;

export interface Media {
  id: string;
  webLink: string;
}

export class RestApi implements Strategy {
  session?: Object;

  constructor() {

  }

  async login(userName: string, password: string): Promise<void> {
    const device = new Client.Device(userName);
    const storage = new Client.CookieFileStorage(`${__dirname}/${userName}.json`);
    const session = await Client.Session.create(device, storage, userName, password)

    this.session = session;
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

  async likeMedias(hashtag: string, options: LikeOptions = {maxLikes: 20}): Promise<void> {
    const {maxLikes} = options;
    console.log('likeMedias', hashtag, maxLikes)
    const results = await this.search(hashtag);
    const likedPhotos = results.slice(0, maxLikes).map((media, index) => {
      return this.likeMedia(media, index * 15000);
    });

    await Promise.all(likedPhotos);
  };


  async likeMedia(media: Media, delay: number) {
    await sleep(delay);
    console.log('likeMedia', media.id, media.webLink);
    await Client.Like.create(this.session, media.id);
  }

  async close() {

  }
}