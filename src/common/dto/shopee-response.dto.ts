import { ApiProperty } from '@nestjs/swagger';

import { StringField, StringFieldOptional } from '../../decorators';

export type ObjectResponse = Record<string, unknown>;

export class ShopeeResponseDto {
  @StringField()
  request_id: string;

  @StringFieldOptional()
  error?: string;

  @StringFieldOptional()
  msg?: string;

  @StringFieldOptional()
  message?: string;
}
export class ShopeeGetResponseDto<T> extends ShopeeResponseDto {
  @ApiProperty()
  response: T;

  @StringFieldOptional({ isArray: true })
  warning?: string[] | string;
}
