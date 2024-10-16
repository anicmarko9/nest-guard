import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { EmailService } from '@Emails/email.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: 'email' })],
  providers: [EmailService],
})
export class TaskModule {}
