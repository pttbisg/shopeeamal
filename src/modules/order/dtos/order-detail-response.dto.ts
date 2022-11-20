import { ApiProperty } from '@nestjs/swagger';

import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { OrderResponse } from './order-response.dto';

class OrderDetailResponse {
  @ApiProperty({ type: OrderResponse, isArray: true })
  order_list: OrderResponse[];
}

export class OrderDetailResponseDto extends ShopeeGetResponseDto<OrderDetailResponse> {}
