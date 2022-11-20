import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { BooleanField, StringFieldOptional } from '../../../decorators';
import { OrderResponse } from './order-response.dto';

class OrderListResponse extends ObjectResponse {
  @BooleanField()
  more: boolean;

  @StringFieldOptional()
  next_cursor?: string;

  @ApiProperty({ type: OrderResponse, isArray: true })
  order_list: OrderResponse[];
}

export class OrderListResponseDto extends ShopeeGetResponseDto<OrderListResponse> {
  @ApiProperty({ type: OrderListResponse })
  response: OrderListResponse;
}
