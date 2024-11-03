import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { User } from './entities/user.entity';
import { CreateUserParams } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private readonly user: Repository<User>) {}

  async find(filters: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<User> {
    const user: User | null = await this.user.findOneBy(filters);

    if (!user) throw new NotFoundException(`User not found.`);

    return user;
  }

  async create(params: CreateUserParams): Promise<User> {
    const id: string = uuid();

    const user: User = this.user.create({ id, ...params });

    try {
      return await this.user.save(user);
    } catch (error) {
      this.handleError(error, 'creating');
    }
  }

  async delete(id: string): Promise<void> {
    const user: User = await this.find({ id });

    try {
      await this.user.remove(user);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(`Something went wrong while deleting a user.`);
    }
  }

  private handleError(error: unknown, action: string): never {
    if (error instanceof QueryFailedError && error?.driverError?.constraint === 'UQ_User_email')
      throw new ConflictException('You already created an account. Try signing in.');

    this.logger.error(error);

    throw new InternalServerErrorException(`Something went wrong while ${action} a user.`);
  }
}
