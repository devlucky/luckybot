export interface LikeOptions {
  maxLikes?: number;
}

export interface Strategy {
  login(userName: string, password: string): Promise<void>;
  likeMedias(hashtag: string, options?: LikeOptions): Promise<void>;
  close(): Promise<void>;
}