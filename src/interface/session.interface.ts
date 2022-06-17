import { Session } from "express-session";

export interface SessionUser {
    username: string;
    lastLoginDate: string;
  }
  
  export interface RequestSession extends Session {
    user: SessionUser;
  }
  