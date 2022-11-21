import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Queue } from 'bull';

import {
  AsyncQueryOptionsDto,
  QueryOptionsDto,
} from '../../common/dto/query-options.dto';
import { QueueResponseDto } from '../../common/dto/queue-response.dto';
import { ShopeeResponseDto } from '../../common/dto/shopee-response.dto';
import { sendQueue } from '../../common/queue';
import { RoleType } from '../../constants';
import { QueueName } from '../../constants/queue';
import { AuthUser } from '../../decorators';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../../modules/user/user.entity';
import { CreateShippingDocumentPayloadDto } from './dtos/create-shipping-document-payload.dto';
import { CreateShippingDocumentResponseDto } from './dtos/create-shipping-document-response.dto';
import { DownloadShippingDocumentPayloadDto } from './dtos/download-shipping-document-payload.dto';
import { ShipOrderPayloadDto } from './dtos/ship-order-payload.dto';
import { ShippingDocumentParameterPayloadDto } from './dtos/shipping-document-parameter-payload.dto';
import { ShippingDocumentParameterResponseDto } from './dtos/shipping-document-parameter-response.dto';
import { ShippingDocumentPayloadDto } from './dtos/shipping-document-payload.dto';
import { ShippingDocumentResponseDto } from './dtos/shipping-document-response.dto';
import { ShippingDocumentResultPayloadDto } from './dtos/shipping-document-result-payload.dto';
import { ShippingDocumentResultResponseDto } from './dtos/shipping-document-result-response.dto';
import { ShippingParameterOptionsDto } from './dtos/shipping-parameter-options.dto';
import { ShippingParameterResponseDto } from './dtos/shipping-parameter-response.dto';
import { TrackingInfoOptionsDto } from './dtos/tracking-info-options.dto';
import { TrackingInfoResponseDto } from './dtos/tracking-info-response.dto';
import { TrackingNumberResponseDto } from './dtos/tracking-number-response.dto';
import { LogisticsService } from './logistics.service';
@Controller('shopee/logistics')
@ApiTags('logistics')
@Auth(true, [RoleType.USER, RoleType.ADMIN])
export class LogisticsController {
  constructor(
    private logisticsService: LogisticsService,
    @InjectQueue(QueueName.logistics) private queue: Queue,
  ) {}

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
  @ApiTags('order')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: ShopeeResponseDto,
    description: 'Ship Order base on get_shipping_parameter',
  })
  @ApiAcceptedResponse({
    type: QueueResponseDto,
    description: 'Ship Order base on get_shipping_parameter asynchronously',
  })
  @ApiBody({ type: ShipOrderPayloadDto })
  async shipOrder(
    @AuthUser() user: UserEntity,
    @Query() options: AsyncQueryOptionsDto,
    @Body() payload: ShipOrderPayloadDto | Map<string, unknown>,
  ): Promise<ShopeeResponseDto> {
    if (options.is_async) {
      await sendQueue(this.queue, 'ship_order', user, options, payload);
    }

    return this.logisticsService.shipOrder(
      options,
      payload as ShipOrderPayloadDto,
    );
  }

  @Post('get_shipping_document_data_info')
  @ApiTags('waybill')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ShippingDocumentResponseDto,
    description: 'Get Shipping Data Info for an Order',
  })
  @ApiBody({ type: ShippingDocumentPayloadDto })
  getShippingDocumentDataInfo(
    @Query() options: QueryOptionsDto,
    @Body() payload: ShippingDocumentPayloadDto | Map<string, unknown>,
  ): Promise<ShippingDocumentResponseDto> {
    return this.logisticsService.getShippingDocumentDataInfo(
      options,
      payload as ShippingDocumentPayloadDto,
    );
  }

  @Post('get_shipping_document_parameter')
  @ApiTags('waybill')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ShippingDocumentParameterResponseDto,
    description: 'Get Shipping Document Parameter for an Order',
  })
  @ApiBody({ type: ShippingDocumentParameterPayloadDto })
  getShippingDocumentParameter(
    @Query() options: QueryOptionsDto,
    @Body() payload: ShippingDocumentParameterPayloadDto | Map<string, unknown>,
  ): Promise<ShippingDocumentParameterResponseDto> {
    return this.logisticsService.getShippingDocumentParameter(
      options,
      payload as ShippingDocumentParameterPayloadDto,
    );
  }

  @Post('create_shipping_document')
  @ApiTags('waybill')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: CreateShippingDocumentResponseDto,
    description: 'Create Shipping Document Based on Parameter',
  })
  @ApiAcceptedResponse({
    type: QueueResponseDto,
    description: 'Create Shipping Document Based on Parameter asynchronously',
  })
  @ApiBody({ type: CreateShippingDocumentPayloadDto })
  async createShippingDocument(
    @AuthUser() user: UserEntity,
    @Query() options: AsyncQueryOptionsDto,
    @Body() payload: CreateShippingDocumentPayloadDto | Map<string, unknown>,
  ): Promise<CreateShippingDocumentResponseDto> {
    if (options.is_async) {
      await sendQueue(
        this.queue,
        'create_shipping_document',
        user,
        options,
        payload,
      );
    }

    return this.logisticsService.createShippingDocument(
      options,
      payload as CreateShippingDocumentPayloadDto,
    );
  }

  @Post('get_shipping_document_result')
  @ApiTags('waybill')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ShippingDocumentResultResponseDto,
    description: 'Get Shipping Document Result for an Order',
  })
  @ApiBody({ type: ShippingDocumentResultPayloadDto })
  getShippingDocumentResult(
    @Query() options: QueryOptionsDto,
    @Body() payload: ShippingDocumentResultPayloadDto | Map<string, unknown>,
  ): Promise<ShippingDocumentResultResponseDto> {
    return this.logisticsService.getShippingDocumentResult(
      options,
      payload as ShippingDocumentResultPayloadDto,
    );
  }

  @Post('download_shipping_document')
  @ApiTags('waybill')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Download Shipping Document',
  })
  @ApiBody({ type: DownloadShippingDocumentPayloadDto })
  downloadShippingDocument(
    @Query() options: QueryOptionsDto,
    @Body() payload: DownloadShippingDocumentPayloadDto | Map<string, unknown>,
  ) {
    return this.logisticsService.downloadShippingDocument(
      options,
      payload as DownloadShippingDocumentPayloadDto,
    );
  }
}
