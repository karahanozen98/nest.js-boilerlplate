import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import { createClient } from 'redis';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'helpers';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { SharedModule } from 'shared/shared.module';
import { ApiConfigService } from 'shared/services/api-config.service';
import { UnprocessableEntityExceptionFilter } from 'filters';
import { GlobalValidationPipe } from 'pipes/global-validation-pipe';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { join } from 'path';
import { globalPrefixExcludeList } from 'constant';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  const reflector = app.get(Reflector);
  const configService = app.select(SharedModule).get(ApiConfigService);

  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    url: configService.apiConfig.sessionCacheUrl,
    legacyMode: true, // RedisStore currently not working with redis version 4.0 or above
  });
  redisClient.on('error', (error) => Logger.error('Redis connection error', error));
  await redisClient.connect();

  app.enableVersioning();
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.use(
    session({
      name: 'sessionId',
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: configService.isProduction, maxAge: 1000 * 60 * 60 * 8 },
      store: new RedisStore({
        client: redisClient,
      }),
    }),
  );

  app.useGlobalFilters(new UnprocessableEntityExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflector));

  app.setGlobalPrefix('api', { exclude: globalPrefixExcludeList });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  await app.listen(configService.apiConfig.port);
  Logger.log(`Application running on ${await app.getUrl()}`);
  return app;
}
bootstrap();
