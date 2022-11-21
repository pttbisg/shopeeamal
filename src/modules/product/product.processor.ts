import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import type { QueryOptionsDto } from '../../common/dto/query-options.dto';
import { ShopeeOauthService } from '../../modules/shopee-oauth/shopee-oauth.service';
import type { UpdateStockPayloadDto } from './dtos/update-stock-payload.dto';
import { ProductService } from './product.service';

@Processor('product')
export class ProductProcessor {
  private readonly logger = new Logger(ProductProcessor.name);

  constructor(
    private productService: ProductService,
    private shopeeOauthService: ShopeeOauthService,
  ) {}

  @Process('update_stock')
  async updateStock(job: Job) {
    const data = job.data;
    await this.shopeeOauthService.canActivate({
      query: data.query,
      user: data.user,
    });

    await this.productService.updateStock(
      data.query as QueryOptionsDto,
      data.payload as UpdateStockPayloadDto,
    );

    this.logger.debug(
      `Queue product.update_stock for ${job.data.queue_id} is done`,
    );
  }
}
