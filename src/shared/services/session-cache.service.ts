import { Injectable } from '@nestjs/common';
import { sessionCache } from 'helpers/cache';

@Injectable()
export class SessionCacheService {
  constructor() {}

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
