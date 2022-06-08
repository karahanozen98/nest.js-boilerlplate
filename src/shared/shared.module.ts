import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { HttpConfigService } from './services/http-config.service';
import { HttpRequestService } from './services/http-request.service';
const providers = [ApiConfigService, HttpConfigService, HttpRequestService];

@Global()
@Module({
  providers,
  imports: [HttpModule.registerAsync({ useExisting: HttpConfigService })],
  exports: [...providers],
})
export class SharedModule {}
