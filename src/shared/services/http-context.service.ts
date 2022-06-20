import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import type { IRequestSession, ISessionUser } from 'interface/session.interface';

import { SessionCacheService } from './session-cache.service';

@Injectable({ scope: Scope.REQUEST })
export class HttpContextService {
  private readonly session: IRequestSession;

  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly sessionCacheService: SessionCacheService,
  ) {
    this.session = this.req.session as IRequestSession;
  }

  get request(): Request {
    return this.req;
  }

  getSession(): IRequestSession {
    return this.session;
  }

  getUser(): ISessionUser {
    return this.session.user;
  }

  setUser(user: ISessionUser) {
    this.session.user = user;
  }

  async destroySession() {
    await this.sessionCacheService.findAndDeleteAsync(`sessionId:${this.session.id}*`); // remove cached responses
    await new Promise((resolve: any) => this.session.destroy(() => resolve())); // destroy session
  }
}
