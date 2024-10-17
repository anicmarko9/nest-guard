import { Global, Module } from '@nestjs/common';

import { AuthService } from '@Auth/auth.service';

@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class UtilModule {}
