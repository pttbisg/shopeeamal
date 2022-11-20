import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { StringField, StringFieldOptional } from '../../../decorators';

export enum OrderDetailOptionalField {
  buyer_user_id = 'buyer_user_id',
  buyer_username = 'buyer_username',
  estimated_shipping_fee = 'estimated_shipping_fee',
  recipient_address = 'recipient_address',
  actual_shipping_fee = 'actual_shipping_fee',
  goods_to_declare = 'goods_to_declare',
  note = 'note',
  note_update_time = 'note_update_time',
  item_list = 'item_list',
  pay_time = 'pay_time',
  dropshipper = 'dropshipper',
  dropshipper_phone = 'dropshipper_phone',
  split_up = 'split_up',
  buyer_cancel_reason = 'buyer_cancel_reason',
  cancel_by = 'cancel_by',
  cancel_reason = 'cancel_reason',
  actual_shipping_fee_confirmed = 'actual_shipping_fee_confirmed',
  buyer_cpf_id = 'buyer_cpf_id',
  fulfillment_flag = 'fulfillment_flag',
  pickup_done_time = 'pickup_done_time',
  package_list = 'package_list',
  shipping_carrier = 'shipping_carrier',
  payment_method = 'payment_method',
  total_amount = 'total_amount',
  invoice_data = 'invoice_data',
  checkout_shipping_carrier = 'checkout_shipping_carrier',
  reverse_shipping_fee = 'reverse_shipping_fee',
  order_chargeable_weight_gram = 'order_chargeable_weight_gram',
  edt = 'edt',
  prescription_images = 'prescription_images',
  prescription_check_status = 'prescription_check_status',
}

export class OrderDetailOptionsDto extends QueryOptionsDto {
  @StringField({ isArray: true })
  order_sn_list: string[] | string;

  @StringFieldOptional({
    isArray: true,
    example: Object.values(OrderDetailOptionalField).join(','),
    default: OrderDetailOptionalField.item_list.toString(),
  })
  response_optional_fields?: string[] | string;
}
