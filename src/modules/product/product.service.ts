import { Injectable } from '@nestjs/common';

import { ShopeeService } from '../../shared/services/shopee.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { ItemBaseInfoOptionsDto } from './dtos/item-base-info-options.dto';
import type { ItemBaseInfoResponseDto } from './dtos/item-base-info-response.dto';
import type { ItemListOptionsDto } from './dtos/item-list-options.dto';
import type { ItemListResponseDto } from './dtos/item-list-response.dto';

@Injectable()
export class ProductService {
  constructor(
    private shopeeService: ShopeeService,
    private validatorService: ValidatorService,
  ) {}

  async getItemList(options: ItemListOptionsDto): Promise<ItemListResponseDto> {
    const response: ItemListResponseDto = await this.shopeeService.apiGet(
      'product/get_item_list',
      options,
    );

    //TODO Add save mechanism

    return response;
  }

  async getItemBaseInfo(
    options: ItemBaseInfoOptionsDto,
  ): Promise<ItemBaseInfoResponseDto> {
    const response: ItemBaseInfoResponseDto = await this.shopeeService.apiGet(
      'product/get_item_base_info',
      options,
    );

    //TODO Add save mechanism

    return response;
  }
}
