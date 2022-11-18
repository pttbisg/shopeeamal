import { ApiProperty } from '@nestjs/swagger';

import { ShopeeResponseDto } from '../../../common/dto/shopee-response.dto';
import { BooleanField, StringFieldOptional } from '../../../decorators';
import type { OrderFullResponse } from './order-response.dto';

class OrderListResponse {
  @BooleanField()
  more: boolean;

  @StringFieldOptional()
  next_cursor: string;

  @ApiProperty()
  order_list: OrderFullResponse[];
}

export class OrderListResponseDto extends ShopeeResponseDto {
  @ApiProperty()
  response: OrderListResponse;

  @StringFieldOptional()
  next_cursor: string;
}
