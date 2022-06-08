import { HttpModuleOptions, HttpModuleOptionsFactory, Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: this.apiConfigService.apiConfig.baseUrl,
      timeout: 5000,
      maxRedirects: 5,
      timeoutErrorMessage: 'UPT Bff - Http Request timeout',
      withCredentials: true,
    };
  }
}
