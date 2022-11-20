import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  BooleanField,
  BooleanFieldOptional,
  NumberFieldOptional,
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class OrderResponse {
  @StringField()
  order_sn: boolean;

  @StringFieldOptional()
  order_status?: string;

  @StringFieldOptional()
  order_internal_id?: string;
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

  @StringField()
  order_status: string;

  @StringFieldOptional()
  shipping_carrier?: string;

  @StringFieldOptional()
  payment_method?: string;

  @NumberFieldOptional()
  estimated_shipping_fee?: number;

  @StringFieldOptional()
  message_to_seller?: string;

  @PositiveIntegerField()
  create_time: number;

  @PositiveIntegerField()
  update_time: number;

  @PositiveIntegerField()
  days_to_ship: number;

  @PositiveIntegerField()
  ship_by_date: number;

  @PositiveIntegerFieldOptional()
  buyer_user_id?: number;

  @StringFieldOptional()
  buyer_username?: string;

  @ApiPropertyOptional()
  recipient_address?: Record<string, unknown>;

  @NumberFieldOptional()
  actual_shipping_fee?: number;

  @BooleanFieldOptional()
  goods_to_declare?: boolean;

  @StringFieldOptional()
  note?: string;

  @PositiveIntegerFieldOptional()
  note_update_time?: number;

  @ApiPropertyOptional()
  item_list?: Array<Record<string, unknown>>;

  @PositiveIntegerFieldOptional()
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

  @PositiveIntegerFieldOptional()
  pickup_done_time?: number;

  @ApiPropertyOptional()
  package_list?: Array<Record<string, unknown>>;

  @ApiPropertyOptional()
  invoice_data?: Record<string, unknown>;

  @StringFieldOptional()
  checkout_shipping_carrier?: string;

  @NumberFieldOptional()
  reverse_shipping_fee?: number;

  @PositiveIntegerFieldOptional()
  order_chargeable_weight_gram?: number;

  @PositiveIntegerFieldOptional()
  edt_from?: number;

  @PositiveIntegerFieldOptional()
  edt_to?: number;

  @StringFieldOptional({ isArray: true })
  prescription_images?: string[];

  @PositiveIntegerFieldOptional()
  prescription_check_status?: number;
}
