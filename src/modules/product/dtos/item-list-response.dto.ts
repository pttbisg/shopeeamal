import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import {
  BooleanField,
  NumberField,
  PositiveIntegerFieldOptional,
} from '../../../decorators';
import { ItemResponse } from './item-response.dto';

class ItemListResponse extends ObjectResponse {
  @NumberField({ int: true })
  total_count: number;

  @BooleanField()
  has_next_page: boolean;

  @PositiveIntegerFieldOptional()
  next_offset: number;

  @ApiProperty({ type: ItemResponse, isArray: true })
  item: ItemResponse[];
}

export class ItemListResponseDto extends ShopeeGetResponseDto<ItemListResponse> {
  @ApiProperty({ type: ItemListResponse })
  response: ItemListResponse;
}
