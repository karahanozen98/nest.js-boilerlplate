import { Controller, Get, Render } from '@nestjs/common';
import { AllowAnonymous } from 'decorators';
import { SkipThrottle } from '@nestjs/throttler';

@AllowAnonymous()
@SkipThrottle()
@Controller('/view')
export class ModelViewController {
  @Get()
  @Render('index')
  renderHomePage() {
    return { title: 'Hello Nest', subtitle: 'Welcome to home page' };
  }

  @Get('about')
  @Render('about')
  renderAboutPage() {
    return { title: 'About', subtitle: 'Welcome to about page' };
  }
}
