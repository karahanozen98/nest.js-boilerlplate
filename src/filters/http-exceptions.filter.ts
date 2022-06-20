import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18nService: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = exception.getResponse() as {
      message: string;
      args: Record<string, unknown>;
    };

    const error = await this.i18nService.translate(message.message ?? message, {
      lang: ctx.getRequest().i18nLang,
      args: message.args,
    });

    response.status(status).json({
      statusCode: status,
      error,
      success: false,
    });
  }
}
