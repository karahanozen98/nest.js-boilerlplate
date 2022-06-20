import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';

import { ALLOW_ANON_KEY } from '../common/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const isAnon =
        this.reflector.get<boolean>(ALLOW_ANON_KEY, ctx.getHandler()) ||
        this.reflector.get<boolean>(ALLOW_ANON_KEY, ctx.getClass());

      if (isAnon) {
        return true;
      }

      const session = ctx.switchToHttp().getRequest().session;

      if (!session) {
        return false;
      }

      return this.validateRequest(session.user);
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  private validateRequest(user: any) {
    return Boolean(user);
  }
}
