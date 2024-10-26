import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private readonly user: Repository<User>) {}

  async find(id: string): Promise<User> {
    const user: User | null = await this.user.findOneBy({ id });

    if (!user) throw new NotFoundException(`User not found.`);

    return user;
  }

  async delete(id: string): Promise<void> {
    const user: User = await this.find(id);

    try {
      await this.user.remove(user);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(`Something went wrong while deleting a user.`);
    }
  }
}
