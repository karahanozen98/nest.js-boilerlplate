import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModuleContainerModule } from 'modules';
import { SharedModule } from 'shared/shared.module';
import { AppController } from './app.controller';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { ApiConfigService } from 'shared/services/api-config.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
          path: path.join(__dirname, '/i18n/'),
          watch: apiConfigService.isDevelopment,
        },
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
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
