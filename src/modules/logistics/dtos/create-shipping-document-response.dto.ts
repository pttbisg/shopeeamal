import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { ObjectResponseField } from '../../../decorators';

class CreateShippingDocumentResponse extends ObjectResponse {
  @ObjectResponseField({ isArray: true })
  result_list: ObjectResponse[];
}

export class CreateShippingDocumentResponseDto extends ShopeeGetResponseDto<CreateShippingDocumentResponse> {
  @ApiProperty({ type: CreateShippingDocumentResponse })
  response: CreateShippingDocumentResponse;
}
