import InstagramClient from 'instagram-private-api';
import {existsSync} from 'fs';
import { Strategy, LikeOptions, Media, StrategyOptions, MediaLocation, User, LikeFollowerOptions } from "./strategy";
import { sleep } from '../util/sleep';

const Client = InstagramClient.V1;

const feedResultsToMedia = (results: any[]): Media[] => {
  return results.map((result: any) => ({
    id: result.id,
    webLink: result._params.webLink
  }))
}

// TODO: move session logic into Session class
export class RestApi implements Strategy {
  session?: Object;
  options: StrategyOptions;

  constructor(options?: StrategyOptions) {
    this.options = options || {cookiePath: __dirname};
  }

  async login(userName: string, password: string): Promise<Object> {
    const device = new Client.Device(userName);
    const {cookiePath, proxyUrl} = this.options;
    const fullCookiePath = `${cookiePath}/${userName}.json`
    console.log('login: exist cookie', {fullCookiePath}, existsSync(fullCookiePath))
    const storage = new Client.CookieFileStorage(fullCookiePath);
    try {
      const session: Object = await Client.Session.create(device, storage, userName, password, proxyUrl)

      this.session = session;
      return session;
    } catch (e) {
      console.log('login error:', e)
      return e;
    }
  }

  async search(hashtag: string): Promise<Media[]> {
    const {session} = this;
    const taggedMedia = new Client.Feed.TaggedMedia(session, hashtag);
    const results = await taggedMedia.get();

    return feedResultsToMedia(results);
  };

  async searchLocation(query: string) {
    const {session} = this;
    const locations = await Client.Location.search(session, query);

    return locations.map((location: any) => {
      return {
        id: location.id,
        title: location.params.title
      }
    });
  }

  async searchMediaByLocation(location: MediaLocation): Promise<Media[]> {
    const {session} = this;
    const medias = new Client.Feed.LocationMedia(session, location.id);
    const results = await medias.get();

    return results;
  }

  async likeTaggedMedias(hashtag: string, options?: LikeOptions): Promise<Media[]> {
    const {maxLikes} = {maxLikes: 20, ...options};
    const medias = await this.search(hashtag);
    console.log('likeMedias', {hashtag, length: medias.length, maxLikes})

    return this.likeMedias(medias, maxLikes);
  };

  async getFollowers(accountId: string): Promise<User[]> {
    const {session} = this;
    const accountFollowers = new Client.Feed.AccountFollowers(session, accountId); //'5465909933'
    const followers = await accountFollowers.get();

    return followers.map((follower: any) => {
      return {
        id: follower.id,
        username: follower.params.username,
        isPrivate: follower.params.isPrivate
      }
    })
  }

  private async likeMedias(medias: Media[], maxLikes: number): Promise<Media[]> {
    const likeMediaPromises = medias.slice(0, maxLikes).map((media, index) => {
      return this.likeMedia(media, index * 15000);
    });
    const likedMedias = await Promise.all(likeMediaPromises);
    
    return likedMedias;
  }

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

  async likeFollowersPhotos(accountId: string, options?: LikeFollowerOptions): Promise<Media[]> {
    const {maxLikes, maxFollowers} = {maxLikes: 5, maxFollowers: 3, ...options};
    const {session} = this;
    const totalLikedMedia = [];
    const publicFollowers = (await this.getFollowers(accountId)).filter(follower => !follower.isPrivate)
    const followers = publicFollowers.slice(0, maxFollowers);
    
    console.log('likeFollowersPhotos', {accountId, maxLikes, maxFollowers, publicFollowersLength: publicFollowers.length});

    for (const follower of followers) {
      console.log('likeFollowersPhotos', {follower})
      const userMedia = new Client.Feed.UserMedia(session, follower.id);
      const feed = await userMedia.get();
      const medias = feedResultsToMedia(feed);
      const likedMedia = await this.likeMedias(medias, maxLikes);

      totalLikedMedia.push(...likedMedia);
    }   

    return totalLikedMedia;
  }

  async getUser(username: string): Promise<User> {
    const {session} = this;
    const user = await Client.Account.searchForUser(session, username);

    return {
      username,
      id: user.id,
      isPrivate: user.params.isPrivate,
      followerCount: user.params.followerCount
    }
  }

  async close() {

  }
}