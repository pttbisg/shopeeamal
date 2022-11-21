import { ApiProperty } from '@nestjs/swagger';

import { NumberField, StringFieldOptional } from '../../../decorators';

class SellerStock {
  @StringFieldOptional()
  location_id?: string;

  @NumberField({ int: true })
  stock: number;
}

export class Stock {
  @NumberField({ int: true })
  model_id?: number;

  @ApiProperty({ type: SellerStock, isArray: true })
  seller_stock: SellerStock[];
}
