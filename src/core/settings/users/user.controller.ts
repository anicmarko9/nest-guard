import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { UserService } from './user.service';
import { AuthService } from '@Auth/auth.service';
import { User } from './entities/user.entity';
import { EmailTemplate } from '@Emails/enums/email.enum';
import { frontURL } from '@Constants/util.constant';
import { FetchUserDTO, SignupCredentials } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: SignupCredentials): Promise<FetchUserDTO> {
    const { email, password } = body;

    // Create New User

    const hashedPassword: string = await this.authService.bcryptHash(password);
    const user: User = await this.userService.create({ email, password: hashedPassword });

    // Generate "verify-email" Token

    const token: string = this.authService.cryptoGenerate();
    const hashedToken: string = this.authService.cryptoHash(token);
    await this.authService.saveToken({ id: user.id, verifyToken: hashedToken });

    // Send "verify-email" Email

    const template: EmailTemplate = EmailTemplate.VERIFY_EMAIL;
    const url: string = this.generateUrl(template, token);

    await this.emailQueue.add('send', {
      data: { template, to: [email], dynamicTemplateData: { url } },
    });

    return new FetchUserDTO(user);
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
