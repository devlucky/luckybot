export interface Media {
  id: string;
  webLink: string;
}

export interface LikeOptions {
  maxLikes?: number;
}

export interface LikeFollowerOptions {
  maxLikes?: number;
  maxFollowers?: number;
}

export interface StrategyOptions {
  cookiePath?: string;
}

export interface MediaLocation {
  id: string;
  title: string;
}

export interface User {
  id: string;
  username: string;
  isPrivate: boolean;
}

export interface Strategy {
  login(userName: string, password: string): Promise<Object>;
  likeTaggedMedias(hashtag: string, options?: LikeOptions): Promise<Media[]>;
  searchLocation(query: string): Promise<MediaLocation>;
  searchMediaByLocation(location: MediaLocation): Promise<Media[]>;
  getFollowers(accountId: string): Promise<User[]>;
  likeFollowersPhotos(accountId: string, options?: LikeFollowerOptions): Promise<Media[]>;
  close(): Promise<void>;
}