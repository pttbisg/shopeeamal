import { ApiPropertyOptional } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  BooleanField,
  BooleanFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberFieldOptional,
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
  TimestampField,
  TimestampFieldOptional,
} from '../../../decorators';
import { OrderStatus } from './order.dto';

export class OrderResponse {
  @StringField()
  order_sn: string;

  @EnumFieldOptional(() => OrderStatus)
  order_status?: OrderStatus;
}

export class OrderFullResponse extends OrderResponse {
  @StringField()
  region: string;

  @StringField()
  currency: string;

  @BooleanField()
  cod: boolean;

  @NumberFieldOptional()
  total_amount?: number;

  @EnumField(() => OrderStatus)
  order_status: OrderStatus;

  @StringFieldOptional()
  shipping_carrier?: string;

  @StringFieldOptional()
  payment_method?: string;

  @NumberFieldOptional()
  estimated_shipping_fee?: number;

  @StringFieldOptional()
  message_to_seller?: string;

  @TimestampField()
  create_time: number;

  @TimestampField()
  update_time: number;

  @PositiveIntegerField()
  days_to_ship: number;

  @TimestampField()
  ship_by_date: number;

  @PositiveIntegerFieldOptional()
  buyer_user_id?: number;

  @StringFieldOptional()
  buyer_username?: string;

  @ApiPropertyOptional()
  recipient_address?: ObjectResponse;

  @NumberFieldOptional()
  actual_shipping_fee?: number;

  @BooleanFieldOptional()
  goods_to_declare?: boolean;

  @StringFieldOptional()
  note?: string;

  @TimestampFieldOptional()
  note_update_time?: number;

  @ApiPropertyOptional({ isArray: true })
  item_list?: ObjectResponse[];

  @TimestampFieldOptional()
  pay_time?: number;

  @StringFieldOptional()
  dropshipper?: string;

  @StringFieldOptional()
  dropshipper_phone?: string;

  @BooleanFieldOptional()
  split_up?: boolean;

  @StringFieldOptional()
  buyer_cancel_reason?: string;

  @StringFieldOptional()
  cancel_by?: string;

  @StringFieldOptional()
  cancel_reason?: string;

  @BooleanFieldOptional()
  actual_shipping_fee_confirmed?: boolean;

  @StringFieldOptional()
  buyer_cpf_id?: string;

  @StringFieldOptional()
  fulfillment_flag?: string;

  @TimestampFieldOptional()
  pickup_done_time?: number;

  @ApiPropertyOptional({ isArray: true })
  package_list?: ObjectResponse[];

  @ApiPropertyOptional()
  invoice_data?: ObjectResponse;

  @StringFieldOptional()
  checkout_shipping_carrier?: string;

  @NumberFieldOptional()
  reverse_shipping_fee?: number;

  @PositiveIntegerFieldOptional()
  order_chargeable_weight_gram?: number;

  @TimestampFieldOptional()
  edt_from?: number;

  @TimestampFieldOptional()
  edt_to?: number;

  @StringFieldOptional({ isArray: true })
  prescription_images?: string[];

  @PositiveIntegerFieldOptional()
  prescription_check_status?: number;
}
