import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShopeeOauthController } from './shopee-oauth.controller';
import { ShopeeOauthEntity } from './shopee-oauth.entity';
import { ShopeeOauthService } from './shopee-oauth.service';

export const handlers = [];

@Module({
  imports: [TypeOrmModule.forFeature([ShopeeOauthEntity])],
  providers: [ShopeeOauthService, ...handlers],
  controllers: [ShopeeOauthController],
})
export class ShopeeOauthModule {}
