import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { HttpContextService } from './services/http-context.service';
import { LanguageService } from './services/language.service';
import { PublicCacheService } from './services/public-cache.service';
import { SessionCacheService } from './services/session-cache.service';
import { WebClientService } from './services/web-client.service';

@Global()
@Module({
  providers: [
    ApiConfigService,
    WebClientService,
    SessionCacheService,
    PublicCacheService,
    HttpContextService,
    LanguageService,
  ],
  exports: [
    ApiConfigService,
    WebClientService,
    SessionCacheService,
    PublicCacheService,
    HttpContextService,
    LanguageService,
  ],
})
export class SharedModule {}
