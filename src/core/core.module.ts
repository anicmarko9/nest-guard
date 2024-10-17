import { Module } from '@nestjs/common';

import { SettingModule } from '@Settings/setting.module';
import { ManagementModule } from '@Management/management.module';

@Module({ imports: [SettingModule, ManagementModule] })
export class CoreModule {}
