import { Body, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BaseController } from 'abstraction';
import { AllowAnonymous, ApiBaseOkResponse, ApiController } from 'decorators';
import { Response } from 'express';
import { IBaseResponse } from 'interface';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/loginDto';

@AllowAnonymous()
@Throttle(5, 60)
@ApiController({ tags: ['Authorization'], path: 'auth', version: '1' })
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  @AllowAnonymous()
  @ApiBaseOkResponse()
  login(@Body() loginDto: LoginDto): IBaseResponse<any> {
    const user = this.authService.login(loginDto);

    return this.ok(user);
  }

  @Post('logout')
  @ApiBaseOkResponse()
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout();
    response.clearCookie('sessionId');

    return this.ok();
  }
}
