import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { PageDto } from 'common/dto/page.dto';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators/http.decorators';
import type { OrderDto } from './dtos/order.dto';
import { OrderDetailOptionsDto } from './dtos/order-detail-options.dto';
import { OrderListOptionsDto } from './dtos/order-list-options.dto';
import { OrderListResponseDto } from './dtos/order-list-response.dto';
import { OrderService } from './order.service';

@Controller('shopee/order')
@ApiTags('order', 'shopee')
@Auth(true, [RoleType.USER, RoleType.ADMIN])
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('get_order_list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OrderListResponseDto,
    description: 'Ge List of Shopee Order',
  })
  getOrderList(
    @Query() options: OrderListOptionsDto,
  ): Promise<OrderListResponseDto> {
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
