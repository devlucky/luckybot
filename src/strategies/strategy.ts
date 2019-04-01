export interface LikeOptions {
  maxLikes?: number;
}

export interface Strategy {
  login(userName: string, password: string): Promise<void>;
  likePhotos(hashtag: string, options?: LikeOptions): Promise<void>;
  close(): Promise<void>;
}