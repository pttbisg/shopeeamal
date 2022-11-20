import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { ObjectResponseFieldOptional } from '../../../decorators';

class ShippingParameterResponse extends ObjectResponse {
  @ObjectResponseFieldOptional()
  info_needed?: ObjectResponse;

  @ObjectResponseFieldOptional()
  dropoff?: ObjectResponse;

  @ObjectResponseFieldOptional()
  pickup?: ObjectResponse;
}

export class ShippingParameterResponseDto extends ShopeeGetResponseDto<ShippingParameterResponse> {}
