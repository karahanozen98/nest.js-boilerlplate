import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { AbstractCacheInterceptor } from 'abstraction';
import type { ICacheOptions } from 'common/cache/interface';
import { ExpirationType } from 'common/cache/interface';
import type { Request } from 'interface';
import type { Observable } from 'rxjs';
import { of, tap } from 'rxjs';

export class UseCacheInterceptor extends AbstractCacheInterceptor {
  constructor(opt?: ICacheOptions) {
    super(opt);
  }

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const session = request.session;
    ctx.switchToRpc().getContext();

    // don't cache respobse if no session avaiable or request is not GET request
    if ((!this.options?.public && !session.user) || request.method !== 'GET') {
      return next.handle();
    }

    const key = this.generateKey(session.id, ctx.getClass().name, request.originalUrl);
    const data = (await this.cache.get(key)) as Record<string, any>;

    if (data) {
      if (this.options?.expiration !== ExpirationType.absolute) {
        void this.cache.set(key, data); // update expire date
      }

      return of(data.response);
    }

    // add data to cache
    return next.handle().pipe(
      tap((response) => {
        void this.cache.set(key, {
          response,
          _originalUrl: request.originalUrl,
          _correlationId: request.correlationId ?? '',
        });
      }),
    );
  }
}

export class ClearCacheInterceptor extends AbstractCacheInterceptor {
  constructor(opt?: ICacheOptions) {
    super(opt);
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const session = request.session;

    if (!this.options?.public && !session.user) {
      return next.handle();
    }

    void this.clearKeys(session.id, ctx.getClass().name);

    return next.handle();
  }

  private async clearKeys(sessionId: string, className: string) {
    const keys = await this.resolveKey(sessionId, className);
    void this.cache.del(keys);
  }
}
