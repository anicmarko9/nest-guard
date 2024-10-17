import { Module } from '@nestjs/common';

import { UserModule } from '@Users/user.module';
import { ProfileModule } from './profiles/profile.module';

@Module({ imports: [UserModule, ProfileModule] })
export class SettingModule {}
