import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { LanguageService } from 'shared/services/language.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly languageService: LanguageService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = exception.getResponse() as {
      message: string;
      args: Record<string, unknown>;
    };

    const error = this.languageService.translate(message.message ?? message, {
      args: message.args,
    });

    response.status(status).json({
      statusCode: status,
      error,
      success: false,
    });
  }
}
