import { Injectable } from '@nestjs/common';
import type { QueryOptionsDto } from 'common/dto/query-options.dto';

import type { ShopeeResponseDto } from '../../common/dto/shopee-response.dto';
import { ShopeeService } from '../../shared/services/shopee.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { CreateShippingDocumentPayloadDto } from './dtos/create-shipping-document-payload.dto';
import type { CreateShippingDocumentResponseDto } from './dtos/create-shipping-document-response.dto';
import type { DownloadShippingDocumentPayloadDto } from './dtos/download-shipping-document-payload.dto';
import type { ShipOrderPayloadDto } from './dtos/ship-order-payload.dto';
import type { ShippingDocumentParameterPayloadDto } from './dtos/shipping-document-parameter-payload.dto';
import type { ShippingDocumentParameterResponseDto } from './dtos/shipping-document-parameter-response.dto';
import type { ShippingDocumentPayloadDto } from './dtos/shipping-document-payload.dto';
import type { ShippingDocumentResponseDto } from './dtos/shipping-document-response.dto';
import type { ShippingDocumentResultPayloadDto } from './dtos/shipping-document-result-payload.dto';
import type { ShippingDocumentResultResponseDto } from './dtos/shipping-document-result-response.dto';
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

  // TODO: Implement this async inside queue
  async shipOrder(
    options: QueryOptionsDto,
    payload: ShipOrderPayloadDto,
  ): Promise<ShopeeResponseDto> {
    const response: ShopeeResponseDto = await this.shopeeService.apiPost(
      'logistics/ship_order',
      payload,
      options,
    );

    return response;
  }

  async getShippingDocumentDataInfo(
    options: QueryOptionsDto,
    payload: ShippingDocumentPayloadDto,
  ): Promise<ShippingDocumentResponseDto> {
    const response: ShippingDocumentResponseDto =
      await this.shopeeService.apiPost(
        'logistics/get_shipping_document_data_info',
        payload,
        options,
      );

    return response;
  }

  async getShippingDocumentParameter(
    options: QueryOptionsDto,
    payload: ShippingDocumentParameterPayloadDto,
  ): Promise<ShippingDocumentParameterResponseDto> {
    const response: ShippingDocumentParameterResponseDto =
      await this.shopeeService.apiPost(
        'logistics/get_shipping_document_parameter',
        payload,
        options,
      );

    return response;
  }

  async createShippingDocument(
    options: QueryOptionsDto,
    payload: CreateShippingDocumentPayloadDto,
  ): Promise<CreateShippingDocumentResponseDto> {
    const response: CreateShippingDocumentResponseDto =
      await this.shopeeService.apiPost(
        'logistics/create_shipping_document',
        payload,
        options,
      );

    return response;
  }

  async getShippingDocumentResult(
    options: QueryOptionsDto,
    payload: ShippingDocumentResultPayloadDto,
  ): Promise<ShippingDocumentResultResponseDto> {
    const response: ShippingDocumentResultResponseDto =
      await this.shopeeService.apiPost(
        'logistics/get_shipping_document_result',
        payload,
        options,
      );

    return response;
  }

  async downloadShippingDocument(
    options: QueryOptionsDto,
    payload: DownloadShippingDocumentPayloadDto,
  ) {
    return this.shopeeService.apiPost(
      'logistics/get_shipping_document_result',
      payload,
      options,
    );
  }
}
