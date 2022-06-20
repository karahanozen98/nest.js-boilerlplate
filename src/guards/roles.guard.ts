import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.get<string[]>('roles', ctx.getHandler()) ||
      this.reflector.get<string[]>('roles', ctx.getClass());

    if (!roles) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return this.validateRoles(user, roles);
  }

  private validateRoles(_user: any, _roles: string[]): boolean {
    return true;
  }
}
