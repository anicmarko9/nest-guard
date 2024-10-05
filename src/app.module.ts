import { Module } from '@nestjs/common';

import { BaseModule } from '@Base/base.module';

@Module({ imports: [BaseModule] })
export class AppModule {}
