import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import type { IAbstractEnum } from 'common/abstract-enum';

import { ObjectResponse } from '../common/dto/shopee-object.dto';
import type {
  INumberFieldOptions,
  IStringFieldOptions,
} from './field.decorators';
import { PositiveIntegerField, StringField } from './field.decorators';

export function PageSizeField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    PositiveIntegerField({ minimum: 1, maximum: 100, example: 10, ...options }),
  );
}

interface ITimestampOptions {
  isInThePast?: boolean;
}

export function PageSizeFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    PageSizeField({ required: false, ...options }),
  );
}

export function TimestampField(
  options: Omit<ApiPropertyOptions, 'type'> &
    INumberFieldOptions &
    ITimestampOptions = {},
): PropertyDecorator {
  return applyDecorators(
    PositiveIntegerField({
      example: options.isInThePast
        ? Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60 // 10 days ago
        : Math.floor(Date.now() / 1000),
      ...options,
    }),
  );
}

export function TimestampFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> &
    INumberFieldOptions &
    ITimestampOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    TimestampField({ required: false, ...options }),
  );
}

export function StringArrayQueryField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(StringField({ isArray: true, ...options }));
}

export function StringArrayQueryFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringArrayQueryField({ required: false, ...options }),
  );
}

export function StringIntegerArrayQueryField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    StringField({ isArray: true, isInteger: true, ...options }),
  );
}

export function StringIntegerArrayQueryFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringIntegerArrayQueryField({ required: false, ...options }),
  );
}

export function StringEnumArrayQueryField<TEnum extends IAbstractEnum<unknown>>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions,
): PropertyDecorator {
  return applyDecorators(
    StringField({
      isArray: true,
      example: Object.values(getEnum()).join(','),
      default: options.default && options.default.toString(),
      ...options,
    }),
  );
}

export function StringEnumArrayQueryFieldOptional<
  TEnum extends IAbstractEnum<unknown>,
>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringEnumArrayQueryField(getEnum, { required: false, ...options }),
  );
}

export function StringEnumArrayQueryExplodeField<
  TEnum extends IAbstractEnum<unknown>,
>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    StringField({
      isArray: true,
      explode: true,
      example: Object.values(getEnum()),
      default: options.default,
      ...options,
    }),
  );
}

export function StringEnumArrayQueryExplodeFieldOptional<
  TEnum extends IAbstractEnum<unknown>,
>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringEnumArrayQueryExplodeField(getEnum, { required: false, ...options }),
  );
}

export function ObjectResponseField(
  options: Omit<ApiPropertyOptions, 'type'> = {},
): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      type: ObjectResponse,
      ...options,
    }),
  );
}

export function ObjectResponseFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    ObjectResponseField({ required: false, ...options }),
  );
}
