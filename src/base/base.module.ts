import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as Joi from 'joi';

import { DatabaseModule } from '@Database/database.module';
import { HealthModule } from '@Health/health.module';
import { CustomThrottlerModule } from '@Throttler/throttler.module';

@Module({
  imports: [
    PrometheusModule.register({ global: true }),
    JwtModule.register({ global: true }),

    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({
        TZ: Joi.string().required(),
        PORT: Joi.string().required(),

        THROTTLE_TTL: Joi.string().required(),
        THROTTLE_LIMIT: Joi.string().required(),

        FRONT_URL: Joi.string().required(),

        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_SSL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_DOMAIN: Joi.string().required(),

        SENDGRID_KEY: Joi.string().required(),
        SENDGRID_FROM: Joi.string().required(),
        SENDGRID_NAME: Joi.string().required(),

        SENDGRID_WELCOME: Joi.string().required(),
        SENDGRID_VERIFY_EMAIL: Joi.string().required(),
        SENDGRID_RESET_PASSWORD: Joi.string().required(),
        SENDGRID_INVITE: Joi.string().required(),
      }),
    }),

    DatabaseModule,
    HealthModule,
    CustomThrottlerModule,
  ],

  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class BaseModule {}
