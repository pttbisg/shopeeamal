import { Injectable } from '@nestjs/common';

import { ShopeeService } from '../../shared/services/shopee.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { ShippingParameterOptionsDto } from './dtos/shipping-parameter-options.dto';
import type { ShippingParameterResponseDto } from './dtos/shipping-parameter-response.dto';
import type { TrackingInfoOptionsDto } from './dtos/tracking-info-options.dto';
import type { TrackingInfoResponseDto } from './dtos/tracking-info-response.dto';
import type { TrackingNumberResponseDto } from './dtos/tracking-number-response.dto';

@Injectable()
export class LogisticsService {
  constructor(
    private shopeeService: ShopeeService,
    private validatorService: ValidatorService,
  ) {}

  async getTrackingInfo(
    options: TrackingInfoOptionsDto,
  ): Promise<TrackingInfoResponseDto> {
    const response: TrackingInfoResponseDto = await this.shopeeService.apiGet(
      'logistics/get_tracking_info',
      options,
    );

    return response;
  }

  async getTrackingNumber(
    options: TrackingInfoOptionsDto,
  ): Promise<TrackingNumberResponseDto> {
    const response: TrackingNumberResponseDto = await this.shopeeService.apiGet(
      'logistics/get_tracking_number',
      options,
    );

    return response;
  }

  async getShippingParameter(
    options: ShippingParameterOptionsDto,
  ): Promise<ShippingParameterResponseDto> {
    const response: ShippingParameterResponseDto =
      await this.shopeeService.apiGet(
        'logistics/get_shipping_parameter',
        options,
      );

    return response;
  }
}
