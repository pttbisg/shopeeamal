import { Column, Entity, Index } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import {
  ItemComplaintPolicy,
  ItemCondition,
  ItemDto,
  ItemStatus,
} from './dtos/item.dto';

@Entity({ name: 'items' })
@UseDto(ItemDto)
export class ItemEntity extends AbstractEntity<ItemDto> {
  @Index({ unique: true })
  @Column({ type: 'integer', nullable: false })
  item_id: number;

  @Column({ type: 'json', nullable: true })
  raw: unknown;

  @Column({ nullable: false })
  @Index()
  shop_id: number;

  @Column({ type: 'enum', enum: ItemStatus, nullable: true })
  item_status?: ItemStatus;

  @Column({ type: 'integer', nullable: true })
  category_id?: number;

  @Column({ nullable: true })
  item_name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  item_sku?: string;

  @Column({ type: 'integer', nullable: true })
  create_time?: number;

  @Column({ type: 'integer', nullable: true })
  update_time?: number;

  @Column({ type: 'json', nullable: true })
  attribute_list?: unknown[];

  @Column({ type: 'json', nullable: true })
  price_info?: unknown[];

  @Column({ type: 'json', nullable: true })
  image?: unknown;

  @Column({ nullable: true })
  weight?: string;

  @Column({ type: 'json', nullable: true })
  dimension?: unknown;

  @Column({ type: 'json', nullable: true })
  logistic_info?: unknown[];

  @Column({ type: 'json', nullable: true })
  preorder?: unknown;

  @Column({ type: 'json', nullable: true })
  wholesales?: unknown[];

  @Column({ type: 'enum', enum: ItemCondition, nullable: true })
  condition?: ItemCondition;

  @Column({ nullable: true })
  has_model?: boolean;

  @Column({ type: 'integer', nullable: true })
  promotion_id?: number;

  @Column({ type: 'json', nullable: true })
  video_info?: unknown[];

  @Column({ type: 'json', nullable: true })
  brand?: unknown;

  @Column({ type: 'integer', nullable: true })
  item_dangerous?: number;

  @Column({ type: 'enum', enum: ItemComplaintPolicy, nullable: true })
  complaint_policy?: ItemComplaintPolicy;

  @Column({ type: 'json', nullable: true })
  tax_info?: unknown;

  @Column({ type: 'json', nullable: true })
  stock_info_v2?: unknown;

  @Column({ type: 'json', nullable: true })
  description_info?: unknown;

  @Column({ nullable: true })
  description_type?: string;

  @Column({ nullable: true })
  gtin_code?: string;
}
