import { Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { AllowAnonymous } from 'decorators';
import { Response } from 'express';
import { AuthService } from './auth.service';

@AllowAnonymous()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnonymous()
  async login(@Res({ passthrough: true }) response: Response) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 2);

    response.cookie('jwtToken', 'token', { httpOnly: true, expires });
    return this.authService.login();
  }
}
