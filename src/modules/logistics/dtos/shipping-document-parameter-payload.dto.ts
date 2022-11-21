import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { StringField, StringFieldOptional } from '../../../decorators';

class OrderParameter {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;
}

export class ShippingDocumentParameterPayloadDto extends ObjectResponse {
  @ApiProperty({ type: OrderParameter, isArray: true })
  order_list: OrderParameter[];
}
