import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@/app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication<AppModule> = await NestFactory.create(AppModule, { forceCloseConnections: true });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  app.use(compression());

  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);

  app.enableCors({ origin: configService.get<string>('FRONT_URL'), credentials: true });
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }),
  );

  app.enableShutdownHooks();

  const port: number = Number(configService.get<string>('PORT'));

  await app.listen(port);
}

bootstrap();
