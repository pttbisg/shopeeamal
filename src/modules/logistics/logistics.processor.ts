import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import type { QueryOptionsDto } from '../../common/dto/query-options.dto';
import { QueueName } from '../../constants/queue';
import { ShopeeOauthService } from '../../modules/shopee-oauth/shopee-oauth.service';
import type { CreateShippingDocumentPayloadDto } from './dtos/create-shipping-document-payload.dto';
import type { ShipOrderPayloadDto } from './dtos/ship-order-payload.dto';
import { LogisticsService } from './logistics.service';

@Processor(QueueName.logistics)
export class LogisticsProcessor {
  private readonly logger = new Logger(LogisticsProcessor.name);

  constructor(
    private logisticsService: LogisticsService,
    private shopeeOauthService: ShopeeOauthService,
  ) {}

  @Process('ship_order')
  async shipOrder(job: Job) {
    const data = job.data;
    await this.shopeeOauthService.canActivate({
      query: data.query,
      user: data.user,
    });

    await this.logisticsService.shipOrder(
      data.query as QueryOptionsDto,
      data.payload as ShipOrderPayloadDto,
    );

    this.logger.debug(
      `Queue product.ship_order for ${job.data.queue_id} is done`,
    );
  }

  @Process('create_shipping_document')
  async createShippingDocument(job: Job) {
    const data = job.data;
    await this.shopeeOauthService.canActivate({
      query: data.query,
      user: data.user,
    });

    await this.logisticsService.createShippingDocument(
      data.query as QueryOptionsDto,
      data.payload as CreateShippingDocumentPayloadDto,
    );

    this.logger.debug(
      `Queue product.ship_order for ${job.data.queue_id} is done`,
    );
  }
}
