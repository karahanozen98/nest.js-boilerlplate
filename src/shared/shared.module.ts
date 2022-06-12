import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { SessionCacheService } from './services/session-cache.service';
import { WebClientService } from './services/web-client.service';

const providers = [ApiConfigService, WebClientService, SessionCacheService];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
