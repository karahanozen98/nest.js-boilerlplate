import { Injectable, Scope } from '@nestjs/common';
import { I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';
import { ApiConfigService } from './api-config.service';

@Injectable({ scope: Scope.REQUEST })
export class LocalizationService {
  constructor(
    private readonly i18n: I18nService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.i18n = i18n;
  }

  get lang(): string {
    return I18nContext.current()?.lang ?? this.apiConfigService.fallbackLanguage;
  }

  translate(key: string, options?: TranslateOptions | undefined): string {
    return this.i18n.translate(key, {
      lang: options?.lang || this.lang,
      args: options?.args,
    });
  }
}
