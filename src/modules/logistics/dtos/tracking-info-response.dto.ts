import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import { ShopeeGetResponseDto } from '../../../common/dto/shopee-response.dto';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { LogisticsStatus } from './logistics.dto';
import { TrackingInfo } from './tracking-info.dto';

class TrackingInfoResponse extends ObjectResponse {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;

  @EnumFieldOptional(() => LogisticsStatus)
  logistics_status?: LogisticsStatus | string;

  @ApiProperty({ type: TrackingInfo, isArray: true })
  tracking_info: TrackingInfo[];
}

export class TrackingInfoResponseDto extends ShopeeGetResponseDto<TrackingInfoResponse> {}
