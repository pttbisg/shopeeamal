import { ApiProperty } from '@nestjs/swagger';

import {
  ObjectResponse,
  ShopeeGetResponseDto,
} from '../../../common/dto/shopee-response.dto';

class ShippingParameterResponse {
  @ApiProperty()
  info_needed: ObjectResponse;

  @ApiProperty()
  dropoff: ObjectResponse;

  @ApiProperty()
  pickup: ObjectResponse;
}

export class ShippingParameterResponseDto extends ShopeeGetResponseDto<ShippingParameterResponse> {}
