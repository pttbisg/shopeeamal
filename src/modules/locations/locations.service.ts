import { Injectable } from '@nestjs/common';

import { ShopeeService } from '../../shared/services/shopee.service';
import type { IGetWarehouseDetailResponse } from './interfaces/get-locations';

@Injectable()
export class LocationsService {
  constructor(private readonly shopeeService: ShopeeService) {}

  async getLocations() {
    const warehouseDetailResponse: IGetWarehouseDetailResponse =
      await this.shopeeService.apiGet('shop/get_warehouse_detail');

    // TODO: Create a request from IMS Service to get existing ecommerce mappings of the specific user
    return warehouseDetailResponse;
  }
}
