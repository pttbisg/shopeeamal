import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { StringField, StringFieldOptional } from '../../../decorators';

class TrackingNumberResponse {
  @StringField()
  tracking_number: string;

  @StringFieldOptional()
  plp_number: string;

  @StringFieldOptional()
  first_mile_tracking_number: string;

  @StringFieldOptional()
  last_mile_tracking_number: string;

  @StringFieldOptional()
  hint?: string;
}

export class TrackingNumberResponseDto extends ShopeeGetResponseDto<TrackingNumberResponse> {}
