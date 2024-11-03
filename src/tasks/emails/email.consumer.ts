import { InternalServerErrorException, Logger, NotImplementedException } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import * as sg from '@sendgrid/mail';

import { EmailTemplate } from './enums/email.enum';
import { EmailAttachment, EmailBodyParams, SendEmailParams } from './interfaces/email.interface';

@Processor('email')
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private readonly key: string = `${this.configService.get<string>('SENDGRID_KEY')}`;
  private readonly from: string = `${this.configService.get<string>('SENDGRID_FROM')}`;
  private readonly name: string = `${this.configService.get<string>('SENDGRID_NAME')}`;

  private readonly templateVerifyEmail: string = `${this.configService.get<string>('SENDGRID_VERIFY_EMAIL')}`;
  private readonly templateWelcome: string = `${this.configService.get<string>('SENDGRID_WELCOME')}`;
  private readonly templateResetPassword: string = `${this.configService.get<string>('SENDGRID_RESET_PASSWORD')}`;
  private readonly templateInvite: string = `${this.configService.get<string>('SENDGRID_INVITE')}`;

  @Process('send')
  private async send(job: Job): Promise<void> {
    const { data, attachments } = job?.data as SendEmailParams;

    try {
      await this.sendWithSendGrid(data, attachments);

      job.moveToCompleted('completed', true);
    } catch (error) {
      const e = error as Error;

      job.moveToFailed({ message: e.message }, true);

      this.logger.error(error);

      throw new InternalServerErrorException(
        'Something went wrong while sending an email with SendGrid.',
      );
    }
  }

  private async sendWithSendGrid(
    data: EmailBodyParams,
    attachments?: EmailAttachment[],
  ): Promise<void> {
    sg.setApiKey(this.key);

    const from = { name: this.name, email: this.from };
    const { to, template, dynamicTemplateData } = data;

    const templateId = this.setTemplate(template);

    try {
      await sg.send({ from, to, templateId, dynamicTemplateData, attachments });
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        `Something went wrong while sending an email with SendGrid.`,
      );
    }
  }

  private setTemplate(template: EmailTemplate): string {
    switch (template) {
      case EmailTemplate.VERIFY_EMAIL:
        return this.templateVerifyEmail;

      case EmailTemplate.WELCOME:
        return this.templateWelcome;

      case EmailTemplate.RESET_PASSWORD:
        return this.templateResetPassword;

      case EmailTemplate.INVITE:
        return this.templateInvite;

      default:
        throw new NotImplementedException(`Email template: ${template} is not yet implemented.`);
    }
  }
}
