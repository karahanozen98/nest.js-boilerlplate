import { Injectable } from '@nestjs/common';
import { sessionCache } from 'common/cache';
import type { ICache } from 'common/cache/interface';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class SessionCacheService {
  client: ICache;

  constructor(apiConfigService: ApiConfigService) {
    this.client = sessionCache.createClient({
      url: apiConfigService.apiConfig.sessionCacheUrl,
    });
  }

  getClient() {
    return this.client;
  }

  async getAsync(key: string) {
    return await this.client.get(key);
  }

  async setAsync(key: string, value: string | Record<string, any>) {
    await this.client.set(key, value);
  }

  async delAsync(key: string | string[]) {
    await this.client.del(key);
  }

  async findAndDeleteAsync(pattern: string) {
    const keys = await this.client.keys(pattern);
    await this.delAsync(keys);
  }
}
