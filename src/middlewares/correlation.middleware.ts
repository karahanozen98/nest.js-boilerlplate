import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request & { correlationId?: string }, _res: Response, next: NextFunction) {
    if (!req.correlationId) {
      req.correlationId = randomUUID();
    }

    next();
  }
}
