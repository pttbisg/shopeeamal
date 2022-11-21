import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemEntity } from './item.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

export const handlers = [];

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [ProductService, ...handlers],
  controllers: [ProductController],
})
export class ProductModule {}
