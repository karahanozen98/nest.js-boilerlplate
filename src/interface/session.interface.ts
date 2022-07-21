import type { Session } from 'express-session';

export interface ISessionUser {
  username: string;
  lastLoginDate: string;
  roles: string[];
}

export type IRequestSession = Session & {
  user?: ISessionUser;
  destroy: (cb: () => void) => void;
};
