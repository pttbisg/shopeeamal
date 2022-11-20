import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { OrderResponse } from './order-response.dto';

class OrderDetailResponse extends ObjectResponse {
  @ApiProperty({ type: OrderResponse, isArray: true })
  order_list: OrderResponse[];
}

export class OrderDetailResponseDto extends ShopeeGetResponseDto<OrderDetailResponse> {
  @ApiProperty({ type: OrderDetailResponse })
  response: OrderDetailResponse;
}
