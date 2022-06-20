import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';
import { HttpContextService } from 'shared/services/http-context.service';

import { ALLOW_ANON_KEY } from '../common/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly httpContextService: HttpContextService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const isAnon =
        this.reflector.get<boolean>(ALLOW_ANON_KEY, ctx.getHandler()) ||
        this.reflector.get<boolean>(ALLOW_ANON_KEY, ctx.getClass());

      if (isAnon) {
        return true;
      }

      const user = this.httpContextService.getUser();

      return user ? true : false;
    } catch (error) {
      Logger.error(error);

      return false;
    }
  }
}
