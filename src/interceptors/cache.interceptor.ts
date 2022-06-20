/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { AbstractCacheInterceptor } from 'abstraction';
import type { ICacheOptions } from 'common/cache/interface';
import { ExpirationType } from 'common/cache/interface';
import type { Observable } from 'rxjs';
import { of, tap } from 'rxjs';

export class UseCacheInterceptor extends AbstractCacheInterceptor {
  constructor(opt?: ICacheOptions) {
    super(opt);
  }

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;
    ctx.switchToRpc().getContext();

    if (!this.options?.public && !session.user) {
      return next.handle();
    }

    const key = this.generateKey(session.id, ctx.getClass().name, ctx.getHandler().name);

    // find key in cache and send with response
    const data = await this.cache.get(key);

    if (data && data._originalUrl === request.originalUrl) {
      if (this.options?.expiration !== ExpirationType.absolute) {
        void this.cache.set(key, { ...data, _originalUrl: request.originalUrl }); // update expire date
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
      tap((response) => {
        void this.cache.set(key, { ...response, _originalUrl: request.originalUrl });
      }),
    );
  }
}

export class ClearCacheInterceptor extends AbstractCacheInterceptor {
  constructor(opt?: ICacheOptions) {
    super(opt);
  }

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line padding-line-between-statements
    if (!request.cookies.sessionId) {
      return next.handle();
    }

    const keys = await this.resolveKey(request.cookies.sessionId, ctx.getClass().name);
    void this.cache.del(keys);

    return next.handle();
  }
}
