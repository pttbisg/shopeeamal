import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { StringField } from '../../../decorators';

export class ShippingParameterOptionsDto extends QueryOptionsDto {
  @StringField()
  order_sn: string;
}
