import { ApiProperty } from '@nestjs/swagger';

import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { LogisticsStatus } from './logistics.dto';
import type { TrackingInfo } from './tracking-info.dto';

class TrackingInfoResponse {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;

  @EnumFieldOptional(() => LogisticsStatus)
  logistics_status?: LogisticsStatus | string;

  @ApiProperty({ isArray: true })
  tracking_info: TrackingInfo[];
}

export class TrackingInfoResponseDto extends ShopeeGetResponseDto<TrackingInfoResponse> {}
