import { ApiProperty } from '@nestjs/swagger';

import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import type { ItemFullResponse } from './item-response.dto';
import { ItemResponse } from './item-response.dto';

class ItemBaseInfoResponse {
  @ApiProperty({ type: ItemResponse, isArray: true })
  item_list: ItemFullResponse[];
}

export class ItemBaseInfoResponseDto extends ShopeeGetResponseDto<ItemBaseInfoResponse> {}
