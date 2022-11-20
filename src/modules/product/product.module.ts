import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

export const handlers = [];

@Module({
  imports: [],
  providers: [ProductService, ...handlers],
  controllers: [ProductController],
})
export class ProductModule {}
