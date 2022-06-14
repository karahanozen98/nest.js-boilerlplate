import { Injectable } from '@nestjs/common';
import { publicCache } from 'common/cache';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class PublicCacheService {
  constructor(apiConfigService: ApiConfigService) {
    publicCache.createClient({ url: apiConfigService.apiConfig.publicCacheUrl });
  }

  async get(key: string) {
    return await publicCache.get(key);
  }

  async set(key: string, value: object) {
    await publicCache.set(key, value);
  }

  async del(key: string | string[]) {
    await publicCache.del(key);
  }
}
