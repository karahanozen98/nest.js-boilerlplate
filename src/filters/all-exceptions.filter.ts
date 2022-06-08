import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';
//import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    let error = exception.getResponse() as {
      key: string;
      args: Record<string, unknown>;
    };

    // Translation can be implemented here like this with nestjs-i18n library
    // message = await this.i18n.translate(message.key, {
    //   lang: ctx.getRequest().i18nLang,
    //   args: message.args,
    // });

    response.status(statusCode).json({ statusCode, error, success: false });
  }
}
