import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModuleContainerModule } from 'modules';
import { SharedModule } from 'shared/shared.module';
import { AppController } from './app.controller';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { ApiConfigService } from 'shared/services/api-config.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters';

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
    SharedModule,
    ModuleContainerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
