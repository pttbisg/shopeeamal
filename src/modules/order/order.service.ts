import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShopeeService } from '../../shared/services/shopee.service';
import type { OrderDetailOptionsDto } from './dtos/order-detail-options.dto';
import type { OrderDetailResponseDto } from './dtos/order-detail-response.dto';
import type { OrderListOptionsDto } from './dtos/order-list-options.dto';
import type { OrderListResponseDto } from './dtos/order-list-response.dto';
import { OrderNotFoundException } from './exceptions/order-not-found.exception';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    private shopeeService: ShopeeService,
  ) {}

  async getOrderList(
    options: OrderListOptionsDto,
  ): Promise<OrderListResponseDto> {
    const response: OrderListResponseDto = await this.shopeeService.apiGet(
      'order/get_order_list',
      options,
    );

    try {
      await this.upsertOrders(response);
    } catch (error) {
      this.logger.error(error);
    }

    return response;
  }

  async upsertOrders(
    response: OrderListResponseDto | OrderDetailResponseDto,
    saveRaw = false,
  ) {
    const orders = response.response.order_list.map((order) => ({
      shop_id: this.shopeeService.oauth.shopId,
      raw: saveRaw ? order : undefined,
      updatedAt: new Date(), // Bug on Typeorm Upsert
      ...order,
    }));

    await this.orderRepository.upsert(orders, ['order_sn']);
  }

  async getOrderDetail(
    options: OrderDetailOptionsDto,
  ): Promise<OrderDetailResponseDto> {
    const response: OrderDetailResponseDto = await this.shopeeService.apiGet(
      'order/get_order_detail',
      options,
    );

    try {
      await this.upsertOrders(response, true);
    } catch (error) {
      this.logger.error(error);
    }

    return response;
  }

  async getSingleOrder(id: Uuid): Promise<OrderEntity> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id });

    const orderEntity = await queryBuilder.getOne();

    if (!orderEntity) {
      throw new OrderNotFoundException();
    }

    return orderEntity;
  }

  async deleteOrder(id: Uuid): Promise<void> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id });

    const orderEntity = await queryBuilder.getOne();

    if (!orderEntity) {
      throw new OrderNotFoundException();
    }

    await this.orderRepository.remove(orderEntity);
  }
}
