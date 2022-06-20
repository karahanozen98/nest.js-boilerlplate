import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';
import { HttpContextService } from 'shared/services/http-context.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly httpContextService: HttpContextService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.get<string[]>('roles', ctx.getHandler()) ||
      this.reflector.get<string[]>('roles', ctx.getClass());

    if (!roles) {
      return true;
    }

    const user = this.httpContextService.getUser();
    const isMatched = roles.some((requestedRole) =>
      user.roles.includes(requestedRole) ? true : false,
    );

    return isMatched ? true : false;
  }
}
