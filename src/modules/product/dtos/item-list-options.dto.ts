import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import {
  NumberField,
  PositiveIntegerField,
  StringEnumArrayQueryExplodeField,
  TimestampFieldOptional,
} from '../../../decorators';
import { ItemStatus } from './item-response.dto';

export class ItemListOptionsDto extends QueryOptionsDto {
  @NumberField({ int: true, example: 0 })
  offset: number;

  @PositiveIntegerField({ example: 10 })
  page_size: number;

  @TimestampFieldOptional({ isInThePast: true })
  update_time_from: number;

  @TimestampFieldOptional()
  update_time_to: number;

  @StringEnumArrayQueryExplodeField(() => ItemStatus)
  item_status: ItemStatus[] | string[];
}
