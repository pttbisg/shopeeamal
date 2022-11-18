import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  BooleanFieldOptional,
  NumberFieldOptional,
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class OrderResponse {
  @StringField()
  order_sn: boolean;

  @StringFieldOptional()
  order_status: string;

  @StringFieldOptional()
  internal_id: string;
}
export class OrderFullResponse extends OrderResponse {
  @StringFieldOptional()
  region: string;

  @StringFieldOptional()
  currency: string;

  @BooleanFieldOptional()
  cod: boolean;

  @NumberFieldOptional()
  total_amount: number;

  @StringFieldOptional()
  shipping_carrier: string;

  @StringFieldOptional()
  payment_method: string;

  @NumberFieldOptional()
  estimated_shipping_fee: number;

  @StringFieldOptional()
  message_to_seller: string;

  @PositiveIntegerFieldOptional()
  create_time: number;

  @PositiveIntegerFieldOptional()
  update_time: number;

  @PositiveIntegerFieldOptional()
  days_to_ship: number;

  @PositiveIntegerFieldOptional()
  ship_by_date: number;

  @PositiveIntegerFieldOptional()
  buyer_user_id: number;

  @StringFieldOptional()
  buyer_username: string;

  @ApiPropertyOptional()
  recipient_address: Record<string, unknown>;

  @NumberFieldOptional()
  actual_shipping_fee: number;

  @BooleanFieldOptional()
  goods_to_declare: boolean;

  @StringFieldOptional()
  note: string;

  @PositiveIntegerFieldOptional()
  note_update_time: number;

  @ApiPropertyOptional()
  item_list: Array<Record<string, unknown>>;

  @PositiveIntegerFieldOptional()
  pay_time: number;

  @StringFieldOptional()
  dropshipper: string;

  @StringFieldOptional()
  dropshipper_phone: string;

  @BooleanFieldOptional()
  split_up: boolean;

  @StringFieldOptional()
  buyer_cancel_reason: string;

  @StringFieldOptional()
  cancel_by: string;

  @StringFieldOptional()
  cancel_reason: string;

  @BooleanFieldOptional()
  actual_shipping_fee_confirmed: boolean;

  @StringFieldOptional()
  buyer_cpf_id: string;

  @StringFieldOptional()
  fulfillment_flag: string;

  @PositiveIntegerFieldOptional()
  pickup_done_time: number;

  @ApiPropertyOptional()
  package_list: Array<Record<string, unknown>>;

  @ApiPropertyOptional()
  invoice_data: Record<string, unknown>;

  @StringFieldOptional()
  checkout_shipping_carrier: string;

  @NumberFieldOptional()
  reverse_shipping_fee: number;

  @PositiveIntegerFieldOptional()
  order_chargeable_weight_gram: number;

  @PositiveIntegerFieldOptional()
  edt_from: number;

  @PositiveIntegerFieldOptional()
  edt_to: number;

  @StringFieldOptional({ isArray: true })
  prescription_images: string[];

  @PositiveIntegerFieldOptional()
  prescription_check_status: number;
}
