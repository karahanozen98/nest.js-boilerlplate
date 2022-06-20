import { applyDecorators, UseInterceptors } from '@nestjs/common';
import type { CacheOptions } from 'common/cache/interface';
import { ClearCacheInterceptor, UseCacheInterceptor } from 'interceptors/';

export function CacheAdd(options?: CacheOptions | undefined): MethodDecorator {
  return applyDecorators(UseInterceptors(new UseCacheInterceptor(options)));
}

export function CacheClear(options?: CacheOptions | undefined): MethodDecorator {
  return applyDecorators(UseInterceptors(new ClearCacheInterceptor(options)));
}
