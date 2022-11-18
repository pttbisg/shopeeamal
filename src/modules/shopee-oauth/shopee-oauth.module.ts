import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../../modules/user/user.module';
import { ShopeeOauthController } from './shopee-oauth.controller';
import { ShopeeOauthEntity } from './shopee-oauth.entity';
import { ShopeeOauthService } from './shopee-oauth.service';

export const handlers = [];

@Global()
@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ShopeeOauthEntity])],
  providers: [ShopeeOauthService, ...handlers],
  controllers: [ShopeeOauthController],
  exports: [ShopeeOauthService],
})
export class ShopeeOauthModule {}
