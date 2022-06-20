import { applyDecorators, UseInterceptors } from '@nestjs/common';
import type { ICacheOptions } from 'common/cache/interface';
import { ClearCacheInterceptor, UseCacheInterceptor } from 'interceptors/';

export function CacheAdd(options?: ICacheOptions | undefined): MethodDecorator {
  return applyDecorators(UseInterceptors(new UseCacheInterceptor(options)));
}

export function CacheClear(options?: ICacheOptions | undefined): MethodDecorator {
  return applyDecorators(UseInterceptors(new ClearCacheInterceptor(options)));
}
