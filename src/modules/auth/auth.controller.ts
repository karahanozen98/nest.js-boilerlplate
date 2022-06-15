import { Body, Controller, Post, Res, Session, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { AllowAnonymous } from 'decorators';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/loginDto';

@AllowAnonymous()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnonymous()
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(loginDto);
    if (!user) {
      response.clearCookie('sessionId');
      throw new UnauthorizedException();
    }
    const expires = new Date();
    expires.setHours(expires.getHours() + 8);

    session.user = {
      username: loginDto.username,
      lastLoginDate: new Date().toISOString(),
    };
    return session.user;
  }
}
