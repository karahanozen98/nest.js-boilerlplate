import type { ControllerOptions } from '@nestjs/common';
import { applyDecorators, Controller } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { LanguageCode } from 'common/constants';

const globalHeaders = [
  ApiHeader({
    name: 'Accept-Language',
    description: 'Select language',
    enum: LanguageCode,
    example: LanguageCode.en,
  }),
];

export function ApiController(options: ControllerOptions & { tags: string[] }) {
  return applyDecorators(
    ApiTags(...options.tags),
    ...globalHeaders,
    Controller({
      path: options.path,
      version: options.version,
      host: options.host,
      scope: options.scope,
    }),
  );
}
