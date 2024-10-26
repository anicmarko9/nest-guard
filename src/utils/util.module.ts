import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from './auth/entities/token.entity';
import { AuthService } from '@Auth/auth.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [AuthService],
  exports: [AuthService],
})
export class UtilModule {}
