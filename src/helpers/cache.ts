import { createClient, RedisClientOptions } from 'redis';
const defaultTTL = 900; // 15 mins

class Cache {
  private client: any;

  constructor(options?: RedisClientOptions) {
    this.client = createClient(options);
    this.client.on('error', (error: Error) => {
      console.log('Redis client error: ', error);
    });
    this.client.connect();
  }

  async get(key: string): Promise<any> {
    try {
      const data = await this.client.get(key);
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      throw error;
    }
  }

  async set(key: string, value: string | object) {
    try {
      let data = typeof value === 'object' ? JSON.stringify({ ...value }) : value;
      await this.client.SET(key, data, { EX: defaultTTL });
    } catch (error) {
      throw error;
    }
  }

  async del(key: string | string[]) {
    try {
      await this.client.del(key);
    } catch (error) {
      throw error;
    }
  }
}

export const sessionCache = new Cache();
export const publicCache = new Cache();
