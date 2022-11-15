import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { ValidatorService } from '../../shared/services/validator.service';
import type { OrderDto } from './dtos/order.dto';
import type { OrderDetailOptionsDto } from './dtos/order-detail-options.dto';
import type { OrderListOptionsDto } from './dtos/order-list-options.dto';
import { OrderNotFoundException } from './exceptions/order-not-found.exception';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  getOrderDetail(_options: OrderDetailOptionsDto): Promise<PageDto<OrderDto>> {
    throw new Error('Method not implemented.');
  }

  getOrderList(_options: OrderListOptionsDto): Promise<PageDto<OrderDto>> {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private validatorService: ValidatorService,
    private commandBus: CommandBus,
  ) {}

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
