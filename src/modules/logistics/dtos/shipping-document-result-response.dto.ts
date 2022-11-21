import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { ShippingDocumentResult } from './shipping-document-result.dto';

class ShippingDocumentResultResponse extends ObjectResponse {
  @ApiProperty({ type: ShippingDocumentResult, isArray: true })
  result_list: ShippingDocumentResult[];
}

export class ShippingDocumentResultResponseDto extends ShopeeGetResponseDto<ShippingDocumentResultResponse> {
  @ApiProperty({ type: ShippingDocumentResultResponse })
  response: ShippingDocumentResultResponse;
}
