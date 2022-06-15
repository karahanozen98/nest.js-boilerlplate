import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { CacheOptions, ExpirationType } from 'common/cache/interface';
import { AbstractCacheInterceptor } from 'abstraction';
import { of, Observable, tap } from 'rxjs';

@Injectable()
export class UseCacheInterceptor extends AbstractCacheInterceptor {
  constructor(opt?: CacheOptions) {
    super(opt);
  }

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    ctx.switchToRpc().getContext();

    if (!this.options?.public && !request.cookies.sessionId) {
      return next.handle();
    }

    const key = this.generateKey(
      request.cookies.sessionId,
      ctx.getClass().name,
      ctx.getHandler().name,
    );

    // find key in cache and send with response
    const data = await this.cache.get(key);
    if (data && data._originalUrl === request.originalUrl) {
      if (this.options?.expiration !== ExpirationType.absolute) {
        this.cache.set(key, { ...data, _originalUrl: request.originalUrl }); // update expire date
      }
      delete data._originalUrl;
      return of(data);
    }

    // don't cache data if not GET request
    if (request.method !== 'GET') {
      return next.handle();
    }

    // add data to cache
    return next.handle().pipe(
      tap(async (data) => {
        this.cache.set(key, { ...data, _originalUrl: request.originalUrl });
      }),
    );
  }
}

export class ClearCacheInterceptor extends AbstractCacheInterceptor {
  constructor(opt?: CacheOptions) {
    super(opt);
  }

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    if (!request.cookies.sessionId) {
      return next.handle();
    }

    const keys = await this.resolveKey(request.cookies.sessionId, ctx.getClass().name);
    this.cache.del(keys);
    return next.handle();
  }
}
