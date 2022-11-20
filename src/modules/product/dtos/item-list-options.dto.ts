import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import {
  NumberField,
  PageSizeField,
  StringEnumArrayQueryExplodeField,
  TimestampFieldOptional,
} from '../../../decorators';
import { ItemStatus } from './item-response.dto';

export class ItemListOptionsDto extends QueryOptionsDto {
  @NumberField({ int: true, example: 0 })
  offset: number;

  @PageSizeField()
  page_size: number;

  @TimestampFieldOptional({ isInThePast: true })
  update_time_from: number;

  @TimestampFieldOptional()
  update_time_to: number;

  @StringEnumArrayQueryExplodeField(() => ItemStatus)
  item_status: ItemStatus[] | string[];
}
