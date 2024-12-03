import { Body, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous, ApiOkResponse, ApiController } from 'decorators';
import { Response } from 'express';
import { ControllerBase, IApiResponse } from 'core/api';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/loginDto';

@AllowAnonymous()
@Throttle({ default: { limit: 3, ttl: 60000 } })
@ApiController({ tags: ['Authorization'], path: 'auth', version: '1' })
export class AuthController extends ControllerBase {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  @AllowAnonymous()
  @ApiOkResponse()
  login(@Body() loginDto: LoginDto): IApiResponse<any> {
    const user = this.authService.login(loginDto);

    return this.ok(user);
  }

  @Post('logout')
  @ApiOkResponse()
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout();
    // response.clearCookie('sessionId');

    return this.ok();
  }
}
