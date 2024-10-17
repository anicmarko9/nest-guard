import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
}
