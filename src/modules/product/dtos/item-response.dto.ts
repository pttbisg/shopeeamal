import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  BooleanFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberFieldOptional,
  ObjectResponseFieldOptional,
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
  TimestampField,
} from '../../../decorators';
import { ItemComplaintPolicy, ItemCondition, ItemStatus } from './item.dto';

export class ItemResponse {
  @PositiveIntegerField()
  item_id: number;

  @EnumField(() => ItemStatus)
  item_status: ItemStatus;

  @TimestampField()
  update_time: number;
}

export class ItemFullResponse extends ItemResponse {
  @PositiveIntegerField()
  category_id: number;

  @StringField()
  item_name: string;

  @StringFieldOptional()
  description?: string;

  @StringFieldOptional()
  item_sku?: string;

  @TimestampField()
  create_time: number;

  @TimestampField()
  update_time: number;

  @ObjectResponseFieldOptional({ isArray: true })
  attribute_list?: ObjectResponse[];

  @ObjectResponseFieldOptional({ isArray: true })
  price_info?: ObjectResponse[];

  @ObjectResponseFieldOptional()
  image?: ObjectResponse;

  @StringFieldOptional()
  weight?: string;

  @ObjectResponseFieldOptional()
  dimension?: ObjectResponse;

  @ObjectResponseFieldOptional({ isArray: true })
  logistic_info?: ObjectResponse[];

  @ObjectResponseFieldOptional()
  preorder?: ObjectResponse;

  @ObjectResponseFieldOptional({ isArray: true })
  wholesales?: ObjectResponse[];

  @EnumFieldOptional(() => ItemCondition)
  condition?: ItemCondition | string;

  @BooleanFieldOptional()
  has_model?: boolean;

  @PositiveIntegerFieldOptional()
  promotion_id?: number;

  @ObjectResponseFieldOptional({ isArray: true })
  video_info?: ObjectResponse[];

  @ObjectResponseFieldOptional()
  brand?: ObjectResponse;

  @NumberFieldOptional({ int: true })
  item_dangerous?: number;

  @EnumFieldOptional(() => ItemComplaintPolicy)
  complaint_policy?: ItemComplaintPolicy | string;

  @ObjectResponseFieldOptional()
  tax_info?: ObjectResponse;

  @ObjectResponseFieldOptional()
  stock_info_v2?: ObjectResponse;

  @ObjectResponseFieldOptional()
  description_info?: ObjectResponse;

  @StringFieldOptional()
  description_type: string;

  @StringFieldOptional()
  gtin_code: string;
}
