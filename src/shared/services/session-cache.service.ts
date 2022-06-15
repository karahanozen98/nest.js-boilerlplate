import { Injectable } from '@nestjs/common';
import { sessionCache } from 'common/cache';
import { ICache } from 'common/cache/interface';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class SessionCacheService {
  client: ICache;
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
