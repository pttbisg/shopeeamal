import { StringField, StringFieldOptional } from '../../decorators';

export class ShopeeResponseDto {
  @StringField()
  request_id: string;

  @StringFieldOptional()
  error: string;

  @StringFieldOptional()
  msg: string;

  @StringFieldOptional()
  message: string;
}
