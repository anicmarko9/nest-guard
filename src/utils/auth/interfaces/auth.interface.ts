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
