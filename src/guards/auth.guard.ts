import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ALLOW_ANON_KEY } from '../constant';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const allowAnonymous =
        this.reflector.get<boolean>(ALLOW_ANON_KEY, ctx.getHandler()) ||
        this.reflector.get<boolean>(ALLOW_ANON_KEY, ctx.getClass());
      if (allowAnonymous) {
        return true;
      }

      const session = ctx.switchToHttp().getRequest().session;
      if (!session) return false;
      return validateRequest(session.user);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

// do authorization logic
function validateRequest(user: any) {
  return !!user;
}
