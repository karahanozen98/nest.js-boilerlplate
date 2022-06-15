import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'helpers';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SharedModule } from 'shared/shared.module';
import { ApiConfigService } from 'shared/services/api-config.service';
import { UnprocessableEntityExceptionFilter } from 'filters';
import { GlobalValidationPipe } from 'pipes/global-validation-pipe';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { sessionCache } from 'common/cache';
import { SessionCacheService } from 'shared/services/session-cache.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  const reflector = app.get(Reflector);
  const configService = app.select(SharedModule).get(ApiConfigService);
  const sessionCacheService = app.select(SharedModule).get(SessionCacheService);
  const RedisStore = createRedisStore(session);

  app.enableVersioning();
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.use(
    session({
      name: 'sessionID',
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: configService.isProduction, maxAge: 1000 * 60 * 60 * 8 },
      store: new RedisStore({
        client: sessionCacheService.getClient(),
      }),
    }),
  );

  app.useGlobalFilters(new UnprocessableEntityExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflector));

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
