import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import { UserService } from './user.service';
import { AuthService } from '@Auth/auth.service';
import { User } from './entities/user.entity';
import { Token } from '@Auth/entities/token.entity';
import { EmailTemplate } from '@Emails/enums/email.enum';
import { frontURL } from '@Constants/util.constant';
import { UpdateTokenParams } from '@Auth/interfaces/auth.interface';
import { ClassicResponseDTO } from '@Utils/dto/util.dto';
import {
  CredentialsDTO,
  CryptoTokenDTO,
  FetchUserDTO,
  ForgotPasswordDTO,
  ResendEmailDTO,
  ResetPasswordDTO,
  SignupCredentials,
} from './dto/user.dto';

@Throttle({ throttler: { limit: 10, ttl: 60000 } })
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() { email, password }: SignupCredentials): Promise<FetchUserDTO> {
    // Create New User

    const hashedPassword: string = await this.authService.bcryptHash(password);
    const user: User = await this.userService.create({ email, password: hashedPassword });

    // Generate "verify-email" Token

    const token: string = this.authService.cryptoGenerate();
    const hashedToken: string = this.authService.cryptoHash(token);
    await this.authService.createToken({ id: user.id, verifyToken: hashedToken });

    // Send "verify-email" Email

    const template: EmailTemplate = EmailTemplate.VERIFY_EMAIL;
    const url: string = this.generateUrl(template, token);

    await this.emailQueue.add('send', {
      data: { template, to: [email], dynamicTemplateData: { url } },
    });

    // Return User info

    return new FetchUserDTO(user);
  }

  @Patch('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Param() { token }: CryptoTokenDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<FetchUserDTO> {
    // Verify User

    const hashedToken: string = this.authService.cryptoHash(token);
    const { id }: Token = await this.authService.findToken({ verifyToken: hashedToken });
    await this.authService.updateToken(id, { verified: true, verifyToken: null });

    // Find User

    const user: User = await this.userService.find({ id });

    // Send "welcome" Email

    const template: EmailTemplate = EmailTemplate.WELCOME;
    const url: string = this.generateUrl(template, 'get-started');

    await this.emailQueue.add('send', {
      data: { template, to: [user.email], dynamicTemplateData: { url } },
    });

    // Set JWT Cookie

    const { jwt, options } = await this.authService.createCookie({ sub: id, verified: true });
    res.cookie('user', jwt, options);

    // Return User info

    return new FetchUserDTO(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { email, password }: CredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<FetchUserDTO> {
    // Find User

    const user: User = await this.userService.find({ email });

    // Authenticate

    const promises: Promise<Token | boolean>[] = [];

    promises.push(this.authService.findToken({ id: user.id }));
    promises.push(this.authService.bcryptCompare(password, user.password));

    const [{ verified }, match] = await Promise.all([
      promises?.[0] as Promise<Token>,
      promises?.[1] as Promise<boolean>,
    ]);

    if (!verified) throw new UnauthorizedException('Email not verified.');
    if (!match) throw new BadRequestException('Incorrect password.');

    // Set JWT Cookie

    const { jwt, options } = await this.authService.createCookie({ sub: user.id, verified: true });
    res.cookie('user', jwt, options);

    // Return User info

    return new FetchUserDTO(user);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response): ClassicResponseDTO {
    // Remove JWT Cookie

    this.authService.deleteCookies(res, ['user']);

    // Return Success message

    return new ClassicResponseDTO({ message: 'Success', statusCode: HttpStatus.OK });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() { email }: ForgotPasswordDTO): Promise<ClassicResponseDTO> {
    // Find User

    const { id }: User = await this.userService.find({ email });

    // Check if email is verified

    const token: Token = await this.authService.findToken({ id });
    if (!token?.verified) throw new ConflictException('Email not verified.');

    // Generate "verify-email" Token

    const cryptoToken: string = this.authService.cryptoGenerate();
    const hashedToken: string = this.authService.cryptoHash(cryptoToken);

    await this.authService.createToken({ id, passwordToken: hashedToken });

    // Send "reset-password" Email

    const template: EmailTemplate = EmailTemplate.RESET_PASSWORD;
    const url: string = this.generateUrl(template, cryptoToken);

    await this.emailQueue.add('send', {
      data: { template, to: [email], dynamicTemplateData: { url } },
    });

    // Return Success message

    return new ClassicResponseDTO({
      message: 'Email to reset password has been sent.',
      statusCode: HttpStatus.OK,
    });
  }

  @Patch('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param() { token }: CryptoTokenDTO,
    @Body() { password }: ResetPasswordDTO,
  ): Promise<FetchUserDTO> {
    // Find token

    const hashedToken: string = this.authService.cryptoHash(token);
    const { id }: Token = await this.authService.findToken({ passwordToken: hashedToken });

    // Check if new password is the same as the previous one

    const user: User = await this.userService.find({ id });
    const match = await this.authService.bcryptCompare(password, user?.password);
    if (match) throw new BadRequestException('Password cannot be the same as the previous one.');

    // Update password

    const hashedPassword: string = await this.authService.bcryptHash(password);
    await this.authService.updateToken(id, { passwordToken: null });
    const updatedUser: User = await this.userService.update(user, { password: hashedPassword });

    // Return User info

    return new FetchUserDTO(updatedUser);
  }

  @Throttle({ throttler: { limit: 2, ttl: 60000 } })
  @Post('resend-email')
  @HttpCode(HttpStatus.OK)
  async resendEmail(@Body() { email, template }: ResendEmailDTO): Promise<ClassicResponseDTO> {
    // Find User

    const { id }: User = await this.userService.find({ email });

    // Check if email is verified

    const { verified }: Token = await this.authService.findToken({ id });

    if (template === EmailTemplate.VERIFY_EMAIL && verified)
      throw new ConflictException('Email already verified.');
    if (template === EmailTemplate.RESET_PASSWORD && !verified)
      throw new ConflictException('Email not verified.');

    // Generate Token

    const token: string = this.authService.cryptoGenerate();
    const hashedToken: string = this.authService.cryptoHash(token);

    // Update Token

    const updateTokenParams: UpdateTokenParams =
      template === EmailTemplate.RESET_PASSWORD
        ? { passwordToken: hashedToken }
        : { verifyToken: hashedToken };

    await this.authService.updateToken(id, { ...updateTokenParams });

    // Send ${template} Email

    const url: string = this.generateUrl(template, token);

    await this.emailQueue.add('send', {
      data: { template, to: [email], dynamicTemplateData: { url } },
    });

    // Return Success message

    return new ClassicResponseDTO({
      message: 'Email has been resent.',
      statusCode: HttpStatus.OK,
    });
  }

  private getMiddlePath(template: EmailTemplate): string {
    switch (template) {
      case EmailTemplate.VERIFY_EMAIL:
        return 'verify-email';

      case EmailTemplate.WELCOME:
        return 'onboarding';

      case EmailTemplate.RESET_PASSWORD:
        return 'reset-password';

      default:
        throw new NotImplementedException(`Not yet implemented for ${template} template.`);
    }
  }

  private generateUrl(template: EmailTemplate, token: string): string {
    const middlePath: string = this.getMiddlePath(template);

    return `${frontURL}/${middlePath}/${token}`;
  }
}
