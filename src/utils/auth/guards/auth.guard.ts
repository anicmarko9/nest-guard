import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';

import { RequestWithCookie } from '@Auth/interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly jwtOptions: JwtVerifyOptions = {
    secret: this.configService.get('JWT_SECRET'),
    ignoreExpiration: false,
  };

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: RequestWithCookie = ctx.switchToHttp().getRequest();

    const { user } = req.cookies;

    try {
      req.user = await this.jwtService.verifyAsync(user, this.jwtOptions);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Not logged in.');
    }

    return true;
  }
}
