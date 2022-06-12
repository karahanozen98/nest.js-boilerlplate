export enum CacheOperation {
  Add,
  Remove,
}

export enum ExpirationType {
  sliding,
  absolute,
}

export interface CacheOptions {
  key?: string;
  expiration?: ExpirationType;
  public?: boolean;
}
