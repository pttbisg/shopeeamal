import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ObjectResponseFieldOptional, StringField } from '../../../decorators';

export class ShipOrderPayloadDto extends ObjectResponse {
  @StringField()
  order_sn: string;

  @ObjectResponseFieldOptional()
  non_integrated?: {
    tracking_number?: string;
  };

  @ObjectResponseFieldOptional()
  dropoff?: {
    branch_id?: number;
    sender_real_name?: string;
    tracking_number?: string;
    slug?: string;
  };

  @ObjectResponseFieldOptional()
  pickup: {
    address_id?: number;
    pickup_time_id?: string;
    tracking_number?: string;
  };
}
