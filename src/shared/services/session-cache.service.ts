import { Injectable } from '@nestjs/common';
import RedisClient from '@redis/client/dist/lib/client';
import { sessionCache } from 'common/cache';
import { RedisFunctions, RedisModules, RedisScripts } from 'redis';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class SessionCacheService {
  client: any;
  constructor(apiConfigService: ApiConfigService) {
    this.client = sessionCache.createClient({
      url: apiConfigService.apiConfig.sessionCacheUrl,
      legacyMode: true,
    });
  }

  getClient() {
    return this.client;
  }

  async getAsync(key: string) {
    return await this.client.get(key);
  }

  async setAsync(key: string, value: object) {
    await this.client.set(key, value);
  }

  async delAsync(key: string | string[]) {
    await this.client.del(key);
  }
}
