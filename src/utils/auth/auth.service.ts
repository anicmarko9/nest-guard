import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { CookieOptions, Response } from 'express';

import { CreateCookieParams, JWTCookie } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly size: number = 32;
  private readonly encoding: string = 'hex';
  private readonly algorithm: string = 'sha256';
  private readonly salt: number = 10;

  private readonly jwtSecret: string | undefined = this.configService.get('JWT_SECRET');
  private readonly jwtDomain: string | undefined = this.configService.get('JWT_DOMAIN');
  private readonly jwtExpiresInDays: number = Number(this.configService.get('JWT_EXPIRES_IN'));
  private readonly jwtExpiresInMilliseconds: number =
    Number(this.configService.get('JWT_EXPIRES_IN')) * 24 * 60 * 60 * 1000;

  cryptoGenerate(): string {
    return crypto.randomBytes(this.size).toString(this.encoding as BufferEncoding);
  }

  cryptoHash(token: string): string {
    return crypto
      .createHash(this.algorithm)
      .update(token)
      .digest(this.encoding as crypto.BinaryToTextEncoding);
  }

  async bcryptHash(value: string): Promise<string> {
    try {
      return await bcrypt.hash(value, this.salt);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(`Something went wrong while encrypting ${value}.`);
    }
  }

  async bcryptCompare(value: string | Buffer, encryptedValue: string): Promise<boolean> {
    try {
      return await bcrypt.compare(value, encryptedValue);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        `Something went wrong while comparing ${value} with it's encrypted counterpart.`,
      );
    }
  }

  private setCookieOptions(): CookieOptions {
    const expires: Date = new Date(Date.now() + this.jwtExpiresInMilliseconds);

    return { httpOnly: true, expires, secure: true, domain: this.jwtDomain };
  }

  async createCookie(params: CreateCookieParams): Promise<JWTCookie> {
    const options: CookieOptions = this.setCookieOptions();

    try {
      const jwt: string = await this.jwtService.signAsync(
        { ...params },
        { secret: this.jwtSecret, expiresIn: `${this.jwtExpiresInDays}d` },
      );

      return { jwt, options };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException('Something went wrong while creating a JWT cookie.');
    }
  }

  deleteCookies(res: Response, cookies: string[]): void {
    cookies.forEach((cookie: string): void => {
      res.clearCookie(cookie, { domain: this.jwtDomain });
    });
  }
}
