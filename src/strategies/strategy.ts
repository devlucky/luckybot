export interface Media {
  id: string;
  webLink: string;
}

export interface LikeOptions {
  maxLikes?: number;
}

export interface Strategy {
  login(userName: string, password: string): Promise<Object>;
  likeMedias(hashtag: string, options?: LikeOptions): Promise<Media[]>;
  close(): Promise<void>;
}