import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Root')
@ApiResponse({ type: 'string' })
export class AppController {
  @Get()
  rootMessage(): string {
    return 'Healthy';
  }
}
