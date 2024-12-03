import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PaginationDetails } from 'core/api';

export function setupSwagger(app: INestApplication): void {
  const logger = new Logger('Swagger');
  const documentBuilder = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Nest.js Boilerplate Documentation')
    .addBearerAuth();

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    extraModels: [PaginationDetails],
  });

  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  logger.log(`Documentation: http://localhost:${process.env.PORT}/documentation`);
}
