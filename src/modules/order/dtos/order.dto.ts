import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { OrderEntity } from '../order.entity';

export class OrderDto extends AbstractDto {
  constructor(entityName: OrderEntity) {
    super(entityName);
  }
}
