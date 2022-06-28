import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import type { AxiosRequestConfig } from 'axios';
import { WEB_CLIENT_CONFIG } from 'common/constants';
import { WebClientService } from 'shared/services/web-client.service';

interface IWebClientModuleArgs {
  config?: AxiosRequestConfig<any> | undefined;
  inject?: any[] | undefined;
  useFactory: (...args: any[]) => AxiosRequestConfig<any>;
}

@Module({})
export class WebClientModule {
  static forRoot(config: AxiosRequestConfig<any> | undefined): DynamicModule {
    return {
      module: WebClientModule,
      providers: [
        {
          provide: WEB_CLIENT_CONFIG,
          useValue: config,
        },
        WebClientService,
      ],
      exports: [WebClientService],
      global: true,
    };
  }

  static forRootAsync(args: IWebClientModuleArgs): DynamicModule {
    const { inject, useFactory } = args;

    return {
      module: WebClientModule,
      providers: [
        {
          provide: WEB_CLIENT_CONFIG,
          useFactory,
          inject,
        },
        WebClientService,
      ],
      exports: [WebClientService],
      global: true,
    };
  }

  // Register
  static register(config: AxiosRequestConfig<any> | undefined): DynamicModule {
    return {
      module: WebClientModule,
      providers: [
        {
          provide: WEB_CLIENT_CONFIG,
          useValue: config,
        },
        WebClientService,
      ],
      exports: [WebClientService],
    };
  }

  static registerAsync(args: IWebClientModuleArgs): DynamicModule {
    const { inject, useFactory } = args;

    return {
      module: WebClientModule,
      providers: [
        {
          provide: WEB_CLIENT_CONFIG,
          useFactory,
          inject,
        },
        WebClientService,
      ],
      exports: [WebClientService],
    };
  }
}
