import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import {
  EnumField,
  EnumFieldOptional,
  PageSizeField,
  StringEnumArrayQueryFieldOptional,
  StringFieldOptional,
  TimestampField,
} from '../../../decorators';
import { OrderStatus } from './order-response.dto';

enum OrderTimeRange {
  create_time = 'create_time',
  update_time = 'update_time',
}

enum OrderListOptionalField {
  order_status = 'order_status',
}

export class OrderListOptionsDto extends QueryOptionsDto {
  @EnumField(() => OrderTimeRange, { example: OrderTimeRange.create_time })
  time_range_field: OrderTimeRange | string;

  @TimestampField({ isInThePast: true })
  time_from: number;

  @TimestampField()
  time_to: number;

  @PageSizeField()
  page_size: number;

  @StringFieldOptional()
  cursor?: string;

  @EnumFieldOptional(() => OrderStatus, { example: OrderStatus.READY_TO_SHIP })
  status?: OrderStatus | string;

  @StringEnumArrayQueryFieldOptional(() => OrderListOptionalField, {
    default: OrderListOptionalField.order_status,
  })
  response_optional_fields?: OrderListOptionalField[] | string =
    OrderListOptionalField.order_status.toString();
}
