import { Get, Render } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous, ApiController } from 'decorators';

@SkipThrottle()
@AllowAnonymous()
@ApiController({ tags: ['views'], path: 'view' })
export class ModelViewController {
  @Get()
  @ApiOkResponse()
  @Render('index')
  renderHomePage() {
    return { title: 'Hello Nest', subtitle: 'Welcome to home page' };
  }

  @Get('about')
  @ApiOkResponse()
  @Render('about')
  renderAboutPage() {
    return { title: 'About', subtitle: 'Welcome to about page' };
  }
}
