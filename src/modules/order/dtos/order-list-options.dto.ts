import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import {
  EnumField,
  EnumFieldOptional,
  PositiveIntegerField,
  StringFieldOptional,
} from '../../../decorators';

enum OrderTimeRange {
  create_time = 'create_time',
  update_time = 'update_time',
}

enum OrderListOptionalField {
  order_status = 'order_status',
}

enum OrderStatus {
  UNPAID = 'UNPAID',
  READY_TO_SHIP = 'READY_TO_SHIP',
  PROCESSED = 'PROCESSED',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  IN_CANCEL = 'IN_CANCEL',
  CANCELLED = 'CANCELLED',
  INVOICE_PENDING = 'INVOICE_PENDING',
}

export class OrderListOptionsDto extends QueryOptionsDto {
  @EnumField(() => OrderTimeRange, { example: OrderTimeRange.create_time })
  time_range_field: OrderTimeRange | string;

  @PositiveIntegerField({
    example: Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60, // 14 days ago
  })
  time_from: number;

  @PositiveIntegerField({ example: Math.floor(Date.now() / 1000) })
  time_to: number;

  @PositiveIntegerField({ example: 10 })
  page_size: number;

  @StringFieldOptional()
  cursor: string;

  @EnumFieldOptional(() => OrderStatus, { example: OrderStatus.READY_TO_SHIP })
  status: OrderStatus | string;

  @StringFieldOptional({
    isArray: true,
    example: Object.values(OrderListOptionalField).join(','),
  })
  response_optional_fields: string[] | string;
}
