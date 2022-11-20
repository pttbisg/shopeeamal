import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { PositiveIntegerField } from '../../../decorators';

export class ModelListOptionsDto extends QueryOptionsDto {
  @PositiveIntegerField()
  item_id: number;
}
