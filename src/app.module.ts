import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpExceptionFilter } from 'filters';
import { AuthGuard } from 'guards/auth.guard';
import { ModuleContainerModule } from 'modules';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { ApiConfigService } from 'shared/services/api-config.service';
import { SharedModule } from 'shared/shared.module';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    I18nModule.forRootAsync({
      resolvers: [AcceptLanguageResolver],
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (apiConfigService: ApiConfigService) => ({
        fallbackLanguage: apiConfigService.fallbackLanguage,
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: apiConfigService.isDevelopment,
        },
        viewEngine: 'ejs',
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    SharedModule,
    ModuleContainerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
      scope: Scope.REQUEST,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
      scope: Scope.REQUEST,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
