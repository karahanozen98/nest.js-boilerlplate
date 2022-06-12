import { Injectable } from "@nestjs/common";
import { publicCache } from "common/cache";

@Injectable()
export class PublicCacheService {
  constructor() {}

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
