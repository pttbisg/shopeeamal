import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import {
  BooleanFieldOptional,
  StringIntegerArrayQueryField,
} from '../../../decorators';

export class ItemBaseInfoOptionsDto extends QueryOptionsDto {
  @StringIntegerArrayQueryField()
  item_id_list: number[] | string;

  @BooleanFieldOptional()
  need_tax_info: boolean;

  @BooleanFieldOptional()
  need_complaint_policy: boolean;
}
