import { UseInterceptors } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { CacheOptions } from 'common/cache';
import { ClearCacheInterceptor, UseCacheInterceptor } from 'interceptors/cache.interceptor';

export function CacheAdd(options?: CacheOptions | undefined): MethodDecorator {
  return applyDecorators(UseInterceptors(new UseCacheInterceptor(options)));
}

export function CacheClear(options?: CacheOptions | undefined): MethodDecorator {
  return applyDecorators(UseInterceptors(new ClearCacheInterceptor(options)));
}
