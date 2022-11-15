import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

export const handlers = [];

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService, ...handlers],
  controllers: [OrderController],
})
export class OrderModule {}
