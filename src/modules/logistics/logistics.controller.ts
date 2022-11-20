import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QueryOptionsDto } from '../../common/dto/query-options.dto';
import { ShopeeResponseDto } from '../../common/dto/shopee-response.dto';
import { RoleType } from '../../constants';
import { Auth } from '../../decorators/http.decorators';
import type { ShipOrderPayloadDto } from './dtos/ship-order-payload.dto';
import { ShippingParameterOptionsDto } from './dtos/shipping-parameter-options.dto';
import { ShippingParameterResponseDto } from './dtos/shipping-parameter-response.dto';
import { TrackingInfoOptionsDto } from './dtos/tracking-info-options.dto';
import { TrackingInfoResponseDto } from './dtos/tracking-info-response.dto';
import { TrackingNumberResponseDto } from './dtos/tracking-number-response.dto';
import { LogisticsService } from './logistics.service';

@Controller('shopee/logistics')
@ApiTags('order', 'shopee')
@Auth(true, [RoleType.USER, RoleType.ADMIN])
export class LogisticsController {
  constructor(private logisticsService: LogisticsService) {}

  @Get('get_tracking_info')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TrackingInfoResponseDto,
    description: 'Get Tracking Info of Order',
  })
  getTrackingInfo(
    @Query() options: TrackingInfoOptionsDto,
  ): Promise<TrackingInfoResponseDto> {
    return this.logisticsService.getTrackingInfo(options);
  }

  @Get('get_tracking_number')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TrackingNumberResponseDto,
    description: 'Get Tracking Number of Order',
  })
  getTrackingNumber(
    @Query() options: TrackingInfoOptionsDto,
  ): Promise<TrackingNumberResponseDto> {
    return this.logisticsService.getTrackingNumber(options);
  }

  @Get('get_shipping_parameter')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ShippingParameterResponseDto,
    description: 'Get Shipping Parameter for an Order',
  })
  getShippingParameter(
    @Query() options: ShippingParameterOptionsDto,
  ): Promise<ShippingParameterResponseDto> {
    return this.logisticsService.getShippingParameter(options);
  }

  @Post('ship_order')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: ShopeeResponseDto,
    description: 'Ship Order base on get_shipping_parameter',
  })
  shipOrder(
    @Query() options: QueryOptionsDto,
    @Body() payload: ShipOrderPayloadDto | Map<string, unknown>,
  ): Promise<ShopeeResponseDto> {
    return this.logisticsService.shipOrder(
      options,
      payload as ShipOrderPayloadDto,
    );
  }
}
