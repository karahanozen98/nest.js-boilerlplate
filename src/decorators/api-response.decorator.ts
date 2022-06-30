/* eslint-disable @typescript-eslint/ban-types */
import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Order } from 'common/constants';
import { PageMetaDto } from 'common/dto/page-meta.dto';

export function ApiBaseOkResponse<T extends Type | string | [Function]>(options: {
  type?: T;
  status?: number;
  description?: string;
}): MethodDecorator & ClassDecorator {
  const opts = {
    status: options.status,
    description: options.description,
  };

  const defaults = {
    success: {
      type: 'boolean',
    },
    error: {
      type: 'object',
      example: null,
    },
  };

  // if type is null or a string type example: 'boolean'
  if (!options.type || typeof options.type === 'string') {
    return applyDecorators(
      ApiResponse({
        ...opts,
        schema: {
          properties: {
            result: {
              type: options.type,
            },
            ...defaults,
          },
        },
      }),
    );
  }

  // If type is Array, example: [UserDto]
  if (typeof options.type === 'object') {
    return applyDecorators(
      ApiExtraModels(options.type[0]),
      ApiResponse({
        ...opts,
        schema: {
          properties: {
            result: {
              type: 'array',
              items: { $ref: getSchemaPath(options.type[0]) },
            },
            ...defaults,
          },
        },
      }),
    );
  }

  // type is a model example: UserDto
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiResponse({
      ...opts,
      schema: {
        properties: {
          result: {
            $ref: getSchemaPath(options.type),
          },
          ...defaults,
        },
      },
    }),
  );
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
