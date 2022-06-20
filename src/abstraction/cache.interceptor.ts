import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { publicCache, sessionCache } from '../common/cache';
import type { ICache, ICacheOptions } from '../common/cache/interface';

export abstract class AbstractCacheInterceptor implements NestInterceptor {
  protected cache: ICache;

  protected options: ICacheOptions | undefined;

  constructor(opt?: ICacheOptions) {
    this.options = opt;
    this.cache = opt?.public ? publicCache : sessionCache;
  }

  intercept(
    _context: ExecutionContext,
    _next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    throw new Error('Method not implemented.');
  }

  protected generateKey(sessionId: string, className: string, handlerName: string): string {
    if (this.options?.public) {
      return this.options?.key
        ? `public-${this.options.key}`
        : `public-${className}-${handlerName}`;
    }

    return this.options?.key
      ? `sessionId:${sessionId}-${this.options.key}`
      : `sessionId:${sessionId}-${className}-${handlerName}`;
  }

  protected async resolveKey(sessionId: string, className: string): Promise<string | string[]> {
    if (this.options?.public) {
      if (this.options.key) {
        return `public-${this.options.key}`;
      }

      return publicCache.keys(`public-${className}*`);
    }

    if (this.options?.key) {
      return `sessionId:${sessionId}-${this.options.key}`;
    }

    // delete all items related to current controller
    const allKeys = sessionCache.keys(`sessionId:${sessionId}-${className}*`);

    return allKeys;
  }
}
