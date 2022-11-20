import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import { ItemFullResponse } from './item-response.dto';

class ItemBaseInfoResponse extends ObjectResponse {
  @ApiProperty({ type: ItemFullResponse, isArray: true })
  item_list: ItemFullResponse[];
}

export class ItemBaseInfoResponseDto extends ShopeeGetResponseDto<ItemBaseInfoResponse> {
  @ApiProperty({ type: ItemBaseInfoResponse })
  response: ItemBaseInfoResponse;
}
