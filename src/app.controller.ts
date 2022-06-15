import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'decorators';

@Controller()
@AllowAnonymous()
@ApiTags('Root')
@ApiResponse({ type: 'string' })
export class AppController {
  @Get()
  rootMessage(): string {
    return 'Healthy';
  }
}
