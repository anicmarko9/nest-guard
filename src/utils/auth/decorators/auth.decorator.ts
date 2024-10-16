import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { CookiePayload, RequestWithCookie } from '@Auth/interfaces/auth.interface';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): CookiePayload => {
  const req: RequestWithCookie = ctx.switchToHttp().getRequest();

  const user: CookiePayload = req.user;

  if (!user || !user.sub)
    throw new UnauthorizedException('Request object without user found unexpectedly.');

  // after user accepts an invitation, he'll be logged in - but he never created his own password beforehand...
  if (!user.verified) throw new BadRequestException('Password not selected.');

  return user;
});

// used only once in the codebase - when 1 user invites another user to join his company
export function assertHasReq(req: Request): asserts req is RequestWithCookie {
  if (!('user' in req))
    throw new UnauthorizedException('Request object without user found unexpectedly.');
}
