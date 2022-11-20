import { ApiPropertyOptional } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-response.dto';
import {
  BooleanFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberFieldOptional,
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
  TimestampField,
} from '../../../decorators';

export enum ItemStatus {
  NORMAL = 'NORMAL',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
  UNLIST = 'UNLIST',
}

export enum ItemCondition {
  NEW = 'NEW',
  USED = 'USED',
}

export enum ItemComplaintPolicy {
  ONE_YEAR = 'ONE_YEAR',
  TWO_YEARS = 'TWO_YEARS',
  OVER_TWO_YEARS = 'OVER_TWO_YEARS',
}

export class ItemResponse {
  @PositiveIntegerField()
  item_id: number;

  @EnumField(() => ItemStatus)
  item_status: ItemStatus | string;

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

  @ApiPropertyOptional()
  attribute_list?: ObjectResponse[];

  @ApiPropertyOptional()
  price_info?: ObjectResponse[];

  @ApiPropertyOptional()
  image?: ObjectResponse;

  @StringFieldOptional()
  weight?: string;

  @ApiPropertyOptional()
  dimension?: ObjectResponse;

  @ApiPropertyOptional()
  logistic_info?: ObjectResponse[];

  @ApiPropertyOptional()
  preorder?: ObjectResponse;

  @ApiPropertyOptional()
  wholesales?: ObjectResponse[];

  @EnumFieldOptional(() => ItemCondition)
  condition?: ItemCondition | string;

  @BooleanFieldOptional()
  has_model?: boolean;

  @PositiveIntegerFieldOptional()
  promotion_id: number;

  @ApiPropertyOptional()
  video_info?: ObjectResponse[];

  @ApiPropertyOptional()
  brand?: ObjectResponse;

  @NumberFieldOptional({ int: true })
  item_dangerous?: number;

  @EnumFieldOptional(() => ItemComplaintPolicy)
  complaint_policy?: ItemComplaintPolicy | string;

  @ApiPropertyOptional()
  tax_info?: ObjectResponse;

  @ApiPropertyOptional()
  stock_info_v2?: ObjectResponse;

  @ApiPropertyOptional()
  description_info?: ObjectResponse;

  @StringFieldOptional()
  description_type: string;

  @StringFieldOptional()
  gtin_code: string;
}
