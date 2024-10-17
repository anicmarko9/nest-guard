import { Module } from '@nestjs/common';

import { UserModule } from '@Users/user.module';

@Module({ imports: [UserModule] })
export class SettingModule {}
