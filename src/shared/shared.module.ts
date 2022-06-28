import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { HttpContextService } from './services/http-context.service';
import { LanguageService } from './services/language.service';
import { PublicCacheService } from './services/public-cache.service';
import { SessionCacheService } from './services/session-cache.service';

@Global()
@Module({
  providers: [
    ApiConfigService,
    SessionCacheService,
    PublicCacheService,
    HttpContextService,
    LanguageService,
  ],
  exports: [
    ApiConfigService,
    SessionCacheService,
    PublicCacheService,
    HttpContextService,
    LanguageService,
  ],
})
export class SharedModule {}
