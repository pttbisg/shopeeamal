import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-response.dto';
import {
  NumberFieldOptional,
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class TierVariation {
  @StringField()
  name: string;

  @ApiProperty()
  option_list: ObjectResponse;
}

export class Model {
  @ApiPropertyOptional()
  price_info?: ObjectResponse[];

  @PositiveIntegerField()
  model_id: number;

  @NumberFieldOptional({ int: true, isArray: true })
  tier_index?: number[];

  @PositiveIntegerFieldOptional()
  promotion_id?: number;

  @StringFieldOptional()
  model_sku?: string;

  @ApiPropertyOptional()
  preorder?: ObjectResponse;

  @ApiPropertyOptional()
  stock_info_v2?: ObjectResponse;

  @StringFieldOptional()
  gtin_code: string;
}
