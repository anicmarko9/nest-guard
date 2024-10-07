import { Module } from '@nestjs/common';

import { EmailModule } from '@Emails/email.module';

@Module({ imports: [EmailModule] })
export class TaskModule {}
