import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueueName } from '../../constants/queue';
import { ItemEntity } from './item.entity';
import { ProductController } from './product.controller';
import { ProductProcessor } from './product.processor';
import { ProductService } from './product.service';

export const handlers = [];

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    BullModule.registerQueue({
      name: QueueName.product,
    }),
  ],
  providers: [ProductService, ProductProcessor, ...handlers],
  controllers: [ProductController],
})
export class ProductModule {}
