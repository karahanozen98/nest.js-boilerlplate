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

export interface ICache {
  get(key: string): Promise<any>;
  keys(pattern: string): Promise<string[]>;
  set(key: string, value: string | object): void;
  del(key: string | string[]): Promise<void>;
}
