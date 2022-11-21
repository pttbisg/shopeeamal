import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { QueryOptionsDto } from 'common/dto/query-options.dto';
import { Repository } from 'typeorm';

import { ShopeeService } from '../../shared/services/shopee.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { ItemBaseInfoOptionsDto } from './dtos/item-base-info-options.dto';
import type { ItemBaseInfoResponseDto } from './dtos/item-base-info-response.dto';
import type { ItemListOptionsDto } from './dtos/item-list-options.dto';
import type { ItemListResponseDto } from './dtos/item-list-response.dto';
import type { ItemResponse } from './dtos/item-response.dto';
import type { ModelListOptionsDto } from './dtos/model-list-options.dto';
import type { ModelListResponseDto } from './dtos/model-list-response.dto';
import type { UpdateStockPayloadDto } from './dtos/update-stock-payload.dto';
import type { UpdateStockResponseDto } from './dtos/update-stock-response.dto';
import { ItemEntity } from './item.entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,

    private shopeeService: ShopeeService,

    private validatorService: ValidatorService,
  ) {}

  async getItemList(options: ItemListOptionsDto): Promise<ItemListResponseDto> {
    const response: ItemListResponseDto = await this.shopeeService.apiGet(
      'product/get_item_list',
      options,
    );

    try {
      await this.upsertItems(response);
    } catch (error) {
      this.logger.error(error);
    }

    return response;
  }

  async getItemBaseInfo(
    options: ItemBaseInfoOptionsDto,
  ): Promise<ItemBaseInfoResponseDto> {
    const response: ItemBaseInfoResponseDto = await this.shopeeService.apiGet(
      'product/get_item_base_info',
      options,
    );

    try {
      await this.upsertItems(response, true);
    } catch (error) {
      this.logger.error(error);
    }

    return response;
  }

  async upsertItems(
    response: ItemListResponseDto | ItemBaseInfoResponseDto,
    saveRaw = false,
  ) {
    const itemObject =
      'item' in response.response
        ? (response.response.item as ItemResponse[])
        : response.response.item_list;
    const items = itemObject.map((order) => ({
      shop_id: this.shopeeService.oauth.shopId,
      raw: saveRaw ? order : undefined,
      updatedAt: new Date(), // Bug on Typeorm Upsert
      ...order,
    }));

    await this.itemRepository.upsert(items, ['item_id']);
  }

  async getModelList(
    options: ModelListOptionsDto,
  ): Promise<ModelListResponseDto> {
    const response: ModelListResponseDto = await this.shopeeService.apiGet(
      'product/get_model_list',
      options,
    );

    return response;
  }

  //TODO Make it on queue
  async updateStock(
    options: QueryOptionsDto,
    payload: UpdateStockPayloadDto,
  ): Promise<UpdateStockResponseDto> {
    const response: UpdateStockResponseDto = await this.shopeeService.apiPost(
      'product/update_stock',
      payload,
      options,
    );

    return response;
  }
}
