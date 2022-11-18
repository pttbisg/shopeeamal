import { ApiProperty } from '@nestjs/swagger';

import { ShopeeResponseDto } from '../../../common/dto/shopee-response.dto';
import { BooleanField, StringFieldOptional } from '../../../decorators';
import { OrderResponse } from './order-response.dto';

class OrderDetailResponse {
  @BooleanField()
  more: boolean;

  @StringFieldOptional()
  next_cursor: string;

  @ApiProperty({ type: OrderResponse, isArray: true })
  order_list: OrderResponse[];
}

export class OrderDetailResponseDto extends ShopeeResponseDto {
  @ApiProperty()
  response: OrderDetailResponse;

  @StringFieldOptional({ isArray: true })
  warning: string[];
}
