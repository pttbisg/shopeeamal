import { ApiProperty } from '@nestjs/swagger';

import { PositiveIntegerField } from '../../../decorators';
import { Stock } from './stock.dto';

export class UpdateStockPayloadDto {
  @PositiveIntegerField()
  item_id: number;

  @ApiProperty({ type: Stock, isArray: true })
  stock_list: Stock[];
}
