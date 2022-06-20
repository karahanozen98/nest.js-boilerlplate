import { Controller, Get, Render } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from 'decorators';

@Controller('/view')
@ApiTags('views')
@SkipThrottle()
@AllowAnonymous()
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
