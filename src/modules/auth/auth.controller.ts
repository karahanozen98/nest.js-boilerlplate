import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger/dist';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from 'decorators';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/loginDto';

@AllowAnonymous()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
@Throttle(5, 60)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnonymous()
  @ApiOkResponse()
  login(@Body() loginDto: LoginDto) {
    const user = this.authService.login(loginDto);

    return user;
  }

  @Post('logout')
  @ApiOkResponse()
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout();
    response.clearCookie('sessionId');
  }
}
