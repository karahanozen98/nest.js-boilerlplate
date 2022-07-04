/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/ban-types */
import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Order } from 'common/constants';
import { PageMetaDto } from 'common/dto/page-meta.dto';

interface IApiResponseOptions {
  status: number;
  description: string | undefined;
  schema: any;
}

export function ApiBaseOkResponse<T extends Type | string | [Function]>(options?: {
  type?: T;
  status?: number;
  description?: string;
}): MethodDecorator & ClassDecorator {
  const resOptions: IApiResponseOptions = {
    status: options?.status ?? 200,
    description: options?.description,
    schema: {
      properties: {
        result: {},
        success: {
          type: 'boolean',
        },
        error: {
          type: 'object',
          example: null,
        },
      },
    },
  };

  if (!options) {
    resOptions.schema.properties.result = null;
  }

  // If type is null or a string type example: 'boolean'
  else if (!options.type || typeof options.type === 'string') {
    resOptions.schema.properties.result = { type: options.type };
  }

  // If type is Array, example: [UserDto]
  else if (typeof options.type === 'object') {
    applyDecorators(ApiExtraModels(options.type[0]));
    resOptions.schema.properties.result = {
      type: 'array',
      items: { $ref: getSchemaPath(options.type[0]) },
    };
  }

  // If type is a model example: UserDto
  else {
    applyDecorators(ApiExtraModels(options.type));
    resOptions.schema.properties.result = {
      $ref: getSchemaPath(options.type),
    };
  }

  return applyDecorators(ApiResponse(resOptions));
}

export function ApiPageOkResponse<T extends Type>(options: {
  type: T;
  status?: number;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiQuery({ name: 'page', type: 'number', example: 10 }),
    ApiQuery({ name: 'take', type: 'number', example: 1 }),
    ApiQuery({ name: 'order', enum: Order, enumName: 'Order', example: Order.ASC }),
    ApiExtraModels(options.type),
    ApiResponse({
      description: options.description,
      status: options.status,
      schema: {
        properties: {
          results: {
            type: 'array',
            items: { $ref: getSchemaPath(options.type) },
          },
          success: {
            type: 'boolean',
          },
          error: {
            type: 'object',
            example: null,
          },
          pagination: {
            $ref: getSchemaPath(PageMetaDto),
          },
        },
      },
    }),
  );
}
