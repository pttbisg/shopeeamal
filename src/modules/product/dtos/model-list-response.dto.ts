import { ApiProperty } from '@nestjs/swagger';

import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import type { Model, TierVariation } from './model-response.dto';

class ModeListResponse {
  @ApiProperty({ isArray: true })
  tier_variation: TierVariation[];

  @ApiProperty({ isArray: true })
  model: Model[];
}

export class ModelListResponseDto extends ShopeeGetResponseDto<ModeListResponse> {}
