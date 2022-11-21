import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { ShippingDocumentType } from './shipping-document-parameter.dto';

class OrderParameter {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;

  @EnumFieldOptional(() => ShippingDocumentType)
  suggest_shipping_document_type?: ShippingDocumentType | string;
}

export class ShippingDocumentResultPayloadDto extends ObjectResponse {
  @ApiProperty({ type: OrderParameter, isArray: true })
  order_list: OrderParameter[];
}
