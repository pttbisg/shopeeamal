import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { StringField, StringFieldOptional } from '../../../decorators';

export class TrackingInfoOptionsDto extends QueryOptionsDto {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;
}
