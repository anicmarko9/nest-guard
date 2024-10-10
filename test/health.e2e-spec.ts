import { type INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

describe('HealthController (e2e)', (): void => {
  let app: INestApplication;

  beforeAll(async (): Promise<void> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());

    app.use(compression());

    const configService: ConfigService = app.get(ConfigService);
    app.enableCors({ origin: configService.get<string>('FRONT_URL'), credentials: true });
    app.use(helmet());

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }),
    );

    app.enableShutdownHooks();

    await app.init();
  });

  it('should be defined', (): void => {
    expect(app).toBeDefined();
  });

  describe('/api/v1/health/database (GET)', (): void => {
    it('should return 200 because database is up and running', async (): Promise<void> => {
      const response: request.Response = await request(app.getHttpServer()).get('/api/v1/health/database');

      expect(response.status).toEqual(200);

      expect(response.body).toEqual({
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      });
    });
  });

  afterAll(async (): Promise<void> => {
    await app?.close?.();
  });
});
