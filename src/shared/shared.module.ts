import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { PublicCacheService } from './services/public-cache.service';
import { SessionCacheService } from './services/session-cache.service';
import { HttpContextService } from './services/http-context.service';
import { WebClientService } from './services/web-client.service';

const providers = [
  ApiConfigService,
  WebClientService,
  SessionCacheService,
  PublicCacheService,
  HttpContextService,
];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
