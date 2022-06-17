import { Body, Controller, Post, Res, Session, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { AllowAnonymous } from 'decorators';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/loginDto';
import { Throttle } from '@nestjs/throttler';

@AllowAnonymous()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
@Throttle(5, 60)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnonymous()
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.login(loginDto);
    return user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout();
    response.clearCookie('sessionId');
    return;
  }
}
