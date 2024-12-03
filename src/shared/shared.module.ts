import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { HttpContextService } from './services/http-context.service';
import { LocalizationService } from './services/localization.service';
import { PublicCacheService } from './services/public-cache.service';
import { SessionCacheService } from './services/session-cache.service';

@Global()
@Module({
  providers: [
    ApiConfigService,
    SessionCacheService,
    PublicCacheService,
    HttpContextService,
    LocalizationService,
  ],
  exports: [
    ApiConfigService,
    SessionCacheService,
    PublicCacheService,
    HttpContextService,
    LocalizationService,
  ],
})
export class SharedModule {}
