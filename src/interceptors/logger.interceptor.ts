import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { appendFile } from 'fs/promises';
import type { Request } from 'interface';
import { cwd } from 'process';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const logInfo = {
      ip: req.ip,
      correlationId: req.correlationId,
      originalUrl: req.originalUrl,
      body: req.body,
      startDate: new Date(),
      endDate: new Date(),
      elapsedSec: 0,
      headers: req.headers,
      response: null,
    };

    return next.handle().pipe(tap((response) => void this.logAsync({ ...logInfo, response })));
  }

  private async logAsync(logInfo): Promise<void> {
    logInfo.endDate = new Date();
    logInfo.elapsedSec = (Number(logInfo.endDate) - Number(logInfo.startDate)) / 1000;
    await appendFile(cwd() + '/requests.log', JSON.stringify(logInfo) + '\n', 'utf-8');
  }
}
