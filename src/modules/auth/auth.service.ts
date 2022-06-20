import { Injectable } from '@nestjs/common';
import { UserNameOrPasswordIncorrectException } from 'exceptions';
import { HttpContextService } from 'shared/services/http-context.service';

import type { LoginDto } from './dto/request/loginDto';

@Injectable()
export class AuthService {
  constructor(private readonly httpContextService: HttpContextService) {}

  login(loginDto: LoginDto) {
    if (!this.validateUser()) {
      throw new UserNameOrPasswordIncorrectException();
    }

    const expires = new Date();
    expires.setHours(expires.getHours() + 8);

    const user = {
      username: loginDto.username,
      lastLoginDate: new Date().toISOString(),
    };

    this.httpContextService.setUser(user);

    return user;
  }

  async logout() {
    await this.httpContextService.destroySession();
  }

  // insert login logic
  private validateUser() {
    return true;
  }
}
