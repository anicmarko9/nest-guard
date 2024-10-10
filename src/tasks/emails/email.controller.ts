import { Controller, Post, HttpCode, HttpStatus, Body, NotImplementedException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Throttle } from '@nestjs/throttler';

import { ALLOWED_RETRY_TEMPLATES, frontURL } from '@Constants/util.constant';
import { EmailTemplate } from './enums/email.enum';
import { ClassicResponseDTO } from '@Utils/dto/util.dto';
import { SendEmailDTO } from './dto/email.dto';

@Controller('emails')
export class EmailController {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  @Throttle({ throttler: { limit: 3, ttl: 60000 } })
  @Post('retry')
  @HttpCode(HttpStatus.OK)
  async retryEmail(@Body() { data, attachments }: SendEmailDTO): Promise<ClassicResponseDTO> {
    const url: string = this.generateURL(data?.template);

    await this.emailQueue.add('send', { data: { ...data, url }, attachments });

    return new ClassicResponseDTO({ message: `Email has been successfully sent.`, statusCode: HttpStatus.OK });
  }

  private generateURL(template: EmailTemplate): string {
    if (!ALLOWED_RETRY_TEMPLATES.includes(template))
      throw new NotImplementedException(`You can not re-send ${template} email.`);

    // ToDo: generate cryptoToken && hashedCryptoToken
    const token: string = `abc`;

    return `${frontURL}/${template}/${token}`;
  }
}
