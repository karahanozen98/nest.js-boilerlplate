import type { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from 'redis';

export enum CacheOperation {
  Add,
  Remove,
}

export enum ExpirationType {
  sliding,
  absolute,
}

export interface ICacheOptions {
  key?: string;
  expiration?: ExpirationType;
  public?: boolean;
}

export interface ICache {
  createClient(
    options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> | undefined,
  ): ICache;
  get(key: string): Promise<any>;
  keys(pattern: string): Promise<string[]>;
  set(key: string, value: string | Record<string, unknown>): Promise<void>;
  del(key: string | string[]): Promise<void>;
}
