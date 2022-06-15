import { Injectable } from '@nestjs/common';
import { publicCache } from 'common/cache';
import { ICache } from 'common/cache/interface';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class PublicCacheService {
  private client: ICache;
  constructor(apiConfigService: ApiConfigService) {
    this.client = publicCache.createClient({
      url: apiConfigService.apiConfig.publicCacheUrl,
      legacyMode: true,
    });
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
