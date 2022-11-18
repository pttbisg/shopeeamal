import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField, StringFieldOptional } from '../../../decorators';
import type { OrderEntity } from '../order.entity';

export class OrderDto extends AbstractDto {
  constructor(entityName: OrderEntity) {
    super(entityName);
  }
}

export class OrderResponse {
  @StringField()
  order_sn: boolean;

  @StringFieldOptional()
  order_status: string;

  @StringFieldOptional()
  internal_id: string;
}
