import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { Auth, ShopeeOauth } from '../../decorators';
import type { OrderDto } from './dtos/order.dto';
import { OrderDetailOptionsDto } from './dtos/order-detail-options.dto';
import { OrderListOptionsDto } from './dtos/order-list-options.dto';
import { OrderService } from './order.service';

@Controller('shopee/orders')
@ApiTags('orders', 'shopee')
@Auth([RoleType.USER, RoleType.ADMIN])
@ShopeeOauth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('get_order_list')
  @HttpCode(HttpStatus.OK)
  getOrderList(
    @Query() options: OrderListOptionsDto,
  ): Promise<PageDto<OrderDto>> {
    return this.orderService.getOrderList(options);
  }

  @Get('get_order_detail')
  @HttpCode(HttpStatus.OK)
  getOrderDetail(
    @Query() options: OrderDetailOptionsDto,
  ): Promise<PageDto<OrderDto>> {
    return this.orderService.getOrderDetail(options);
  }
}
