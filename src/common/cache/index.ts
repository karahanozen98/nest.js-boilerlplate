import { Logger } from '@nestjs/common';
import type {
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import { createClient } from 'redis';

import type { ICache } from './interface';

const defaultTTL = 900; // 15 mins

class Cache implements ICache {
  private client: RedisClientType<any, any, any>;

  private logger: Logger = new Logger('Cache');

  createClient(
    options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> | undefined,
  ): ICache {
    this.client = createClient(options);

    this.client.on('error', (error: Error) => {
      this.logger.error('Redis client error: ', error);
    });
    this.client.on('connect', () => {
      this.logger.log('Redis connection established');
    });

    void (async () => {
      await this.client.connect();
    })();

    return this;
  }

  async get(key: string): Promise<string | Record<string, any> | null> {
    try {
      const data = await this.client.get(key);

      return data ? this.parseJson(data) : null;
    } catch (error) {
      this.logger.error(error);

      return null;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(error);

      return [];
    }
  }

  async set(key: string, value: string | Record<string, unknown>): Promise<void> {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify({ ...value });
      await this.client.set(key, data, { EX: defaultTTL });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async del(key: string | string[]) {
    try {
      if (key && key.length > 0) {
        await this.client.del(key);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  private parseJson(str: string) {
    try {
      const json = JSON.parse(str);

      return json;
    } catch {
      return str;
    }
  }
}

export const sessionCache = new Cache();
export const publicCache = new Cache();
