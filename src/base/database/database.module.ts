import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: Number(configService.get<string>('POSTGRES_PORT')),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        ssl:
          `${configService.get<string>('POSTGRES_SSL')}` === 'true'
            ? { rejectUnauthorized: true }
            : false,
        entities: [join(__dirname, '../../', '**', '*.entity.{ts,js}')],
        synchronize: false,
        migrations: [join(__dirname, '../../../', 'migrations', '*.{ts,js}')],
        migrationsRun: true,
      }),
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): BullModuleOptions => ({
        name: 'redis_queue',
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<string>('REDIS_PORT')),
        },
        settings: { lockDuration: 24 * 60 * 60 * 1000, stalledInterval: 0 },
      }),
    }),
  ],
})
export class DatabaseModule {}
