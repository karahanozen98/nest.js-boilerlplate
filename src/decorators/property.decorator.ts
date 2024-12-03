import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type as ClassTransformerType } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import type { IApiArrayPropertyParams } from 'interface';

import { getVariableName } from '../common/utils/get-variable-name';

export function ApiStringProperty(): PropertyDecorator {
  return applyDecorators(ApiProperty({ type: String }), IsString());
}

export function ApiNumberProperty(): PropertyDecorator {
  return applyDecorators(ApiProperty({ type: Number }), IsNumber());
}

export function ApiBooleanProperty(options: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({ type: Boolean, ...options });
}

export function ApiBooleanPropertyOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> = {},
): PropertyDecorator {
  return ApiBooleanProperty({ required: false, ...options });
}

export function ApiUUIDProperty(options: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    type: 'string',
    format: 'uuid',
    isArray: options.isArray,
    ...options,
  });
}

export function ApiUUIDPropertyOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'required'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return ApiUUIDProperty({ required: false, ...options });
}

export function ApiEnumProperty<TEnum>(
  getEnum: () => TEnum,
  options: ApiPropertyOptions,
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enumValue = getEnum() as any;

  return ApiProperty({
    type: 'integer',
    // throw error during the compilation of swagger
    // isArray: options.each,
    enum: enumValue,
    enumName: getVariableName(getEnum),
    ...options,
  });
}

export function ApiEnumPropertyOptional<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & {
    each?: boolean;
  } = {},
): PropertyDecorator {
  return ApiEnumProperty(getEnum, { required: false, ...options });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiModelProperty(options: { type: Function }) {
  const { type } = options;

  return applyDecorators(
    ApiProperty({ type }),
    ValidateNested(),
    ClassTransformerType(() => type),
  );
}

export function ApiArrayProperty(options?: IApiArrayPropertyParams): PropertyDecorator {
  const type = options?.type;
  const decorators = [ApiProperty({ type: Function, isArray: true }), IsArray()];

  if (!type) {
    return applyDecorators(...decorators);
  }

  switch (type) {
    case Number: {
      decorators.push(IsNumber({}, { each: true }));
      break;
    }

    case String: {
      decorators.push(IsString({ each: true }));
      break;
    }

    case Boolean: {
      decorators.push(IsBoolean({ each: true }));
      break;
    }

    default: {
      decorators.push(
        ValidateNested({ each: true }),
        ClassTransformerType(() => type),
      );
    }
  }

  return applyDecorators(...decorators);
}
