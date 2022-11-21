import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { ShippingDocumentParameter } from './shipping-document-parameter.dto';

class ShippingDocumentParameterResponse extends ObjectResponse {
  @ApiProperty({ type: ShippingDocumentParameter, isArray: true })
  result_list: ShippingDocumentParameter[];
}

export class ShippingDocumentParameterResponseDto extends ShopeeGetResponseDto<ShippingDocumentParameterResponse> {
  @ApiProperty({ type: ShippingDocumentParameterResponse })
  response: ShippingDocumentParameterResponse;
}
