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

enum OrderOptionalField {
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
  @EnumField(() => OrderTimeRange)
  time_range_field: OrderTimeRange;

  @PositiveIntegerField()
  time_from: number;

  @PositiveIntegerField()
  time_to: number;

  @PositiveIntegerField()
  page_size: number;

  @StringFieldOptional()
  cursor: string;

  @EnumFieldOptional(() => OrderStatus)
  status: OrderStatus;

  @EnumFieldOptional(() => OrderOptionalField)
  response_optional_fields: OrderOptionalField;
}
