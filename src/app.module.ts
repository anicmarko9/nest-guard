import { Module } from '@nestjs/common';

import { BaseModule } from '@Base/base.module';
import { UtilModule } from '@Utils/util.module';
import { TaskModule } from '@Tasks/task.module';
import { CoreModule } from '@Core/core.module';

@Module({ imports: [BaseModule, UtilModule, TaskModule, CoreModule] })
export class AppModule {}
