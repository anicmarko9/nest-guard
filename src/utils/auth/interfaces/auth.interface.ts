import { CookieOptions, Request } from 'express';

export interface JWTCookie {
  jwt: string;
  options: CookieOptions;
}

export interface CreateCookieParams {
  sub: string;
  verified: boolean;
}

export interface CookiePayload {
  sub: string;
  verified: boolean;
  iat: number;
  exp: number;
}

export type RequestWithCookie = Request & { user: CookiePayload };

export interface SaveTokenParams {
  id: string;
  verifyToken?: string | null;
  passwordToken?: string | null;
  inviteToken?: string | null;
}

export interface UpdateTokenParams extends Omit<SaveTokenParams, 'id'> {
  verified?: boolean;
}
