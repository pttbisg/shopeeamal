import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { ShopeeService } from '../../shared/services/shopee.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { OrderDto } from './dtos/order.dto';
import type { OrderDetailOptionsDto } from './dtos/order-detail-options.dto';
import type { OrderListOptionsDto } from './dtos/order-list-options.dto';
import type { OrderListResponseDto } from './dtos/order-list-response.dto';
import { OrderNotFoundException } from './exceptions/order-not-found.exception';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  getOrderDetail(_options: OrderDetailOptionsDto): Promise<PageDto<OrderDto>> {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    private shopeeService: ShopeeService,
    private validatorService: ValidatorService,
  ) {}

  async getOrderList(
    options: OrderListOptionsDto,
  ): Promise<OrderListResponseDto> {
    const response: OrderListResponseDto = await this.shopeeService.apiGet(
      'order/get_order_list',
      options,
    );

    //TODO Add save mechanism

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
