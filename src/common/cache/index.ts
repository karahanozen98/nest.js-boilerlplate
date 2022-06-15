import { Logger } from '@nestjs/common';
import { createClient } from 'redis';
import { ICache } from './interface';
const defaultTTL = 900; // 15 mins

class Cache implements ICache {
  private client: any;

  createClient(options?: any): ICache {
    this.client = createClient(options);

    this.client.on('error', (error: Error) => {
      Logger.error('Redis client error: ', error);
    });
    this.client.on('connect', () => {
      Logger.verbose('Redis connection established');
    });

    (async () => {
      await this.client.connect();
    })();

    return this.client;
  }

  async get(key: string): Promise<any> {
    try {
      const data = await this.client.get(key);
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async set(key: string, value: string | object): Promise<void> {
    try {
      let data = typeof value === 'object' ? JSON.stringify({ ...value }) : value;
      await this.client.SET(key, data, { EX: defaultTTL });
    } catch (error) {
      console.error(error);
    }
  }

  async del(key: string | string[]) {
    try {
      if (key && key.length > 0) await this.client.del(key);
    } catch (error) {
      console.error(error);
    }
  }
}

export const sessionCache = new Cache();
export const publicCache = new Cache();
