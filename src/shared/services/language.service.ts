import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import type { I18nContext, TranslateOptions } from 'nestjs-i18n';
import { getI18nContextFromRequest } from 'nestjs-i18n';

@Injectable({ scope: Scope.REQUEST })
export class LanguageService {
  private readonly context: I18nContext;

  constructor(@Inject(REQUEST) request: Request) {
    this.context = getI18nContextFromRequest(request);
  }

  get lang(): string {
    return this.context.lang;
  }

  translate(key: string, options?: TranslateOptions | undefined) {
    return this.context.translate(key, {
      lang: options?.lang || this.lang,
      args: options?.args,
    });
  }
}
