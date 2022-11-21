import { Column, Entity, Index } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { OrderDto } from './dtos/order.dto';
import { OrderStatus } from './dtos/order-response.dto';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  @Index({ unique: true })
  @Column({ nullable: false })
  order_sn: string;

  @Column({ type: 'json', nullable: true })
  raw: unknown;

  @Column({ nullable: false })
  @Index()
  shop_id: number;

  @Column({ type: 'enum', enum: OrderStatus, nullable: true })
  order_status?: OrderStatus;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  cod?: boolean;

  @Column({ nullable: true })
  total_amount?: number;

  @Column({ nullable: true })
  shipping_carrier?: string;

  @Column({ nullable: true })
  payment_method?: string;

  @Column({ nullable: true })
  estimated_shipping_fee?: number;

  @Column({ nullable: true })
  message_to_seller?: string;

  @Column({ type: 'integer', nullable: true })
  create_time: number;

  @Column({ type: 'integer', nullable: true })
  update_time: number;

  @Column({ type: 'integer', nullable: true })
  days_to_ship: number;

  @Column({ type: 'integer', nullable: true })
  ship_by_date: number;

  @Column({ type: 'integer', nullable: true })
  buyer_user_id?: number;

  @Column({ nullable: true })
  buyer_username?: string;

  @Column({ type: 'json', nullable: true })
  recipient_address?: unknown;

  @Column({ nullable: true })
  actual_shipping_fee?: number;

  @Column({ nullable: true })
  goods_to_declare?: boolean;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: 'integer', nullable: true })
  note_update_time?: number;

  @Column({ type: 'json', nullable: true })
  item_list?: unknown[];

  @Column({ type: 'integer', nullable: true })
  pay_time?: number;

  @Column({ nullable: true })
  dropshipper?: string;

  @Column({ nullable: true })
  dropshipper_phone?: string;

  @Column({ nullable: true })
  split_up?: boolean;

  @Column({ nullable: true })
  buyer_cancel_reason?: string;

  @Column({ nullable: true })
  cancel_by?: string;

  @Column({ nullable: true })
  cancel_reason?: string;

  @Column({ nullable: true })
  actual_shipping_fee_confirmed?: boolean;

  @Column({ nullable: true })
  buyer_cpf_id?: string;

  @Column({ nullable: true })
  fulfillment_flag?: string;

  @Column({ type: 'integer', nullable: true })
  pickup_done_time?: number;

  @Column({ type: 'json', nullable: true })
  package_list?: unknown[];

  @Column({ type: 'json', nullable: true })
  invoice_data?: unknown;

  @Column({ nullable: true })
  checkout_shipping_carrier?: string;

  @Column({ nullable: true })
  reverse_shipping_fee?: number;

  @Column({ type: 'integer', nullable: true })
  order_chargeable_weight_gram?: number;

  @Column({ type: 'integer', nullable: true })
  edt_from?: number;

  @Column({ type: 'integer', nullable: true })
  edt_to?: number;

  @Column({ type: 'json', nullable: true })
  prescription_images?: string[];

  @Column({ type: 'integer', nullable: true })
  prescription_check_status?: number;
}
