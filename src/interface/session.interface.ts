import type { Session } from 'express-session';

export interface ISessionUser {
  username: string;
  lastLoginDate: string;
  roles: string[];
}

export interface IRequestSession extends Session {
  user: ISessionUser;
}
