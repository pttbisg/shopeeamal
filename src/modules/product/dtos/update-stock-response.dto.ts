import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { ObjectResponseField } from '../../../decorators';

class UpdateStockResponse extends ObjectResponse {
  @ObjectResponseField({ isArray: true })
  failure_list: ObjectResponse[];

  @ObjectResponseField({ isArray: true })
  success_list: ObjectResponse[];
}

export class UpdateStockResponseDto extends ShopeeGetResponseDto<UpdateStockResponse> {
  @ApiProperty({ type: UpdateStockResponse })
  response: UpdateStockResponse;
}
