import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { LocalizationService } from 'shared/services/localization.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly localizationService: LocalizationService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseData = exception.getResponse() as {
      message: string;
      args: Record<string, unknown>;
    };

    const error = this.localizationService.translate(responseData.message ?? responseData, {
      args: responseData.args,
    });

    response.status(status).send({
      statusCode: status,
      message: error,
      success: false,
    });
  }
}
