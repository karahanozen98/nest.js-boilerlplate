import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      // const request = context.switchToHttp().getRequest();
      // const response = context.switchToHttp().getResponse();
      return validateRequest();
    } catch (error) {
      return false;
    }
  }
}

// handles authorization guard
function validateRequest() {
  return true;
}
