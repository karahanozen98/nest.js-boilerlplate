import { Injectable } from '@nestjs/common';
import { sessionCache } from 'common/cache';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class SessionCacheService {
  constructor(apiConfigService: ApiConfigService) {
    sessionCache.createClient({ url: apiConfigService.apiConfig.sessionCacheUrl });
  }

  async get(key: string) {
    return await sessionCache.get(key);
  }

  async set(key: string, value: object) {
    await sessionCache.set(key, value);
  }

  async del(key: string | string[]) {
    await sessionCache.del(key);
  }
}
