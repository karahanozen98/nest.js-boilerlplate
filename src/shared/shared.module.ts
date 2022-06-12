import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { PublicCacheService } from './services/public-cache.service';
import { SessionCacheService } from './services/session-cache.service';
import { WebClientService } from './services/web-client.service';

const providers = [ApiConfigService, WebClientService, SessionCacheService, PublicCacheService];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
