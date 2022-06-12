import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { publicCache, sessionCache } from '../common/cache';
import { CacheOptions, ICache } from '../common/cache/interface';

export abstract class AbstractCacheInterceptor implements NestInterceptor {
  protected cache: ICache;
  protected options: CacheOptions | undefined;
  constructor(opt?: CacheOptions) {
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
      return await publicCache.keys(`public-${className}*`);
    }
    if (this.options?.key) {
      return `sessionId:${sessionId}-${this.options.key}`;
    }
    // delete all items related to current controller
    const allKeys = await sessionCache.keys(`sessionId:${sessionId}-${className}*`);

    return allKeys;
  }
}
