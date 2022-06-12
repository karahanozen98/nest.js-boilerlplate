import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'helpers';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SharedModule } from 'shared/shared.module';
import { ApiConfigService } from 'shared/services/api-config.service';
import { UnprocessableEntityExceptionFilter } from 'filters';
import { GlobalValidationPipe } from 'pipes/global-validation-pipe';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  const reflector = app.get(Reflector);
  const configService = app.select(SharedModule).get(ApiConfigService);

  app.enableVersioning();
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      //store: new RedisStore(), //default is memory storage which is not useful in production
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
  console.info(`Application running on ${await app.getUrl()}`);
  return app;
}
bootstrap();
