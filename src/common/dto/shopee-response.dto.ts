import {
  ObjectResponseField,
  StringField,
  StringFieldOptional,
} from '../../decorators';
import type { ObjectResponse } from './shopee-object.dto';

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
export class ShopeeGetResponseDto<
  T extends ObjectResponse,
> extends ShopeeResponseDto {
  // TODO: Automatically infer the type for docs @ApiProperty({ type: T })
  @ObjectResponseField()
  response: T;

  @StringFieldOptional({ isArray: true })
  warning?: string[] | string;
}
