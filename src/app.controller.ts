import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'decorators';

@Controller()
@AllowAnonymous()
@ApiTags('Root')
export class AppController {
  @Get()
  @ApiResponse({ type: 'string' })
  rootMessage(): string {
    return 'Healthy';
  }
}
