import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { CacheOptions, ExpirationType } from 'common/cache';
import { of, Observable, tap } from 'rxjs';
import { sessionCache } from 'helpers/cache';

@Injectable()
export class UseCacheInterceptor implements NestInterceptor {
  private options: CacheOptions | undefined;
  constructor(opt?: CacheOptions) {
    this.options = opt;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    context.switchToRpc().getContext();

    if (!request.cookies.sessionId) {
      return next.handle();
    }

    const key = this.options?.key
      ? `sessionId:${request.cookies.sessionId}-${this.options.key}`
      : `sessionId:${request.cookies.sessionId}-${context.getClass().name}-${
          context.getHandler().name
        }`;

    // find key in cache and send with response
    const data = await sessionCache.get(key);
    if (data && data._originalUrl === request.originalUrl) {
      if (this.options?.expiration !== ExpirationType.absolute) {
        sessionCache.set(key, { ...data, _originalUrl: request.originalUrl }); // update expire date
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
        await sessionCache.set(key, { ...data, _originalUrl: request.originalUrl });
      }),
    );
  }
}

export class ClearCacheInterceptor implements NestInterceptor {
  private options: CacheOptions | undefined;
  constructor(opt?: CacheOptions) {
    this.options = opt;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (!request.cookies.sessionId) {
      return next.handle();
    }

    if (this.options?.key) {
      // delete item by key
      sessionCache.del(`sessionId:${request.cookies.sessionId}-${this.options.key}`);
    } else {
      // delete all items related to current controller
      const allKeys = await sessionCache.keys(
        `sessionId:${request.cookies.sessionId}-${context.getClass().name}*`,
      );
      sessionCache.del(allKeys);
    }

    return next.handle();
  }
}
