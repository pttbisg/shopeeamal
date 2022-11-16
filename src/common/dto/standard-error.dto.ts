import { ApiPropertyOptional } from '@nestjs/swagger';

import { StringField, StringFieldOptional } from '../../decorators';
import { ShopeeResponseDto } from './shopee-response.dto';

class ShopeeErrorDto extends ShopeeResponseDto {
  @StringField()
  error: string;
}

export class StandardErrorDto {
  @StringFieldOptional()
  readonly statusCode: string;

  @StringFieldOptional()
  readonly message: string;

  @StringFieldOptional()
  readonly error: string;

  @ApiPropertyOptional()
  readonly shopee_error: ShopeeErrorDto;
}
