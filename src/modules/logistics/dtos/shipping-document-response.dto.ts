import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import {
  ObjectResponseFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

class ShippingDocumentResponse extends ObjectResponse {
  @ObjectResponseFieldOptional()
  recipient_address_info?: ObjectResponse;

  @ObjectResponseFieldOptional()
  shipping_document_info?: ObjectResponse;

  @StringFieldOptional()
  cod_amount: ObjectResponse;

  @StringFieldOptional()
  order_weight: string;
}

export class ShippingDocumentResponseDto extends ShopeeGetResponseDto<ShippingDocumentResponse> {
  @ApiProperty({ type: ShippingDocumentResponse })
  response: ShippingDocumentResponse;
}
