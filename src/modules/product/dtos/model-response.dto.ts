import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  NumberFieldOptional,
  ObjectResponseFieldOptional,
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class TierVariation {
  @StringField()
  name: string;

  @ObjectResponseFieldOptional()
  option_list: ObjectResponse;
}

export class Model {
  @ObjectResponseFieldOptional({ isArray: true })
  price_info?: ObjectResponse[];

  @PositiveIntegerField()
  model_id: number;

  @NumberFieldOptional({ int: true, isArray: true })
  tier_index?: number[];

  @PositiveIntegerFieldOptional()
  promotion_id?: number;

  @StringFieldOptional()
  model_sku?: string;

  @ObjectResponseFieldOptional()
  preorder?: ObjectResponse;

  @ObjectResponseFieldOptional()
  stock_info_v2?: ObjectResponse;

  @StringFieldOptional()
  gtin_code: string;
}
