import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter as BullExpressAdapter } from '@bull-board/express';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Queue } from 'bull';
import compression from 'compression';
import expressBasicAuth from 'express-basic-auth';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { QueueName } from './constants/queue';
import { AuthFailedFilter } from './filters/auth-failed.filter';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain

  // Very high limit, the client should be internal user
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 10_000, // limit each IP to 10000 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
    new AuthFailedFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.isProduction) {
    app.use(helmet());
  }

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  if (configService.adminQueueEnabled) {
    const bullServerAdapter = new BullExpressAdapter();
    createBullBoard({
      queues: Object.values(QueueName).map(
        (name) => new BullAdapter(app.get<Queue>(`BullQueue_${name}`)),
      ),
      serverAdapter: bullServerAdapter,
    });

    bullServerAdapter.setBasePath('/admin/queues');

    const config = configService.adminQueueConfig;

    app.use(
      '/admin/queues',
      expressBasicAuth({
        users: {
          [config.username]: config.password,
        },
        challenge: true,
      }),
      bullServerAdapter.getRouter(),
    );
  }

  app.use(expressCtx);

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);

  return app;
}

void bootstrap();
