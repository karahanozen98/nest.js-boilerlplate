export interface ISessionUser {
  username: string;
  lastLoginDate: string;
  roles: string[];
}

export interface IRequestSession {
  id: string;
  user?: ISessionUser;
  destroy: (cb: () => void) => void;
}
