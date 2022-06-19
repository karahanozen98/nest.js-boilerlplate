import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RequestSession, SessionUser } from 'interface/session.interface';
import { SessionCacheService } from './session-cache.service';

@Injectable({ scope: Scope.REQUEST })
export class HttpContextService {
  private readonly session: RequestSession;
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly sessionCacheService: SessionCacheService,
  ) {
    this.session = this.req.session as RequestSession;
  }

  get request(): Request {
    return this.req;
  }

  getSession(): RequestSession {
    return this.session;
  }

  getUser(): SessionUser {
    return this.session.user;
  }

  setUser(user: SessionUser) {
    this.session.user = user;
  }

  async destroySession() {
    await this.sessionCacheService.findAndDeleteAsync(`sessionId:${this.session.id}*`); // remove cached responses
    return await new Promise((resolve: any) => this.session.destroy(() => resolve()));
  }
}
