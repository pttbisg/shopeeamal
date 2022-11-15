import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { UserEntity } from '../../modules/user/user.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ShopeeService } from '../../shared/services/shopee.service';
import type { OauthUrlOptionsDto } from './dtos/oauth-url-options.dto';
import { ShopeeOauthDto } from './dtos/shopee-oauth.dto';
import { ShopeeOauthNotFoundException } from './exceptions/shopee-oauth-not-found.exception';
import { ShopeeOauthEntity } from './shopee-oauth.entity';

@Injectable()
export class ShopeeOauthService {
  refreshAcessToken(_createShopeeOauthDto: ShopeeOauthDto) {
    throw new Error('Method not implemented.');
  }

  getAccessToken(_createShopeeOauthDto: ShopeeOauthDto) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(ShopeeOauthEntity)
    private shopeeOauthRepository: Repository<ShopeeOauthEntity>,
    private shopeeService: ShopeeService,
    private apiConfigService: ApiConfigService,
  ) {}

  getOauthUrl(getOauthUrlOption: OauthUrlOptionsDto, user: UserEntity) {
    this.shopeeService.user = user;
    const query = {
      redirect:
        getOauthUrlOption.redirect ||
        this.apiConfigService.shopeeOauthRedirectUrl,
    };

    return this.shopeeService.buildFullUrl('shop/auth_partner', query);
  }

  @Transactional()
  async createShopeeOauth(
    createShopeeOauthDto: ShopeeOauthDto,
  ): Promise<ShopeeOauthEntity> {
    const queryBuilder = this.shopeeOauthRepository
      .createQueryBuilder('shopeeOauth')
      .where('shopeeOauth.id = :id', { id: createShopeeOauthDto.id });

    const shopeeOauthEntity = await queryBuilder.getOne();

    if (!shopeeOauthEntity) {
      throw new ShopeeOauthNotFoundException();
    }

    return shopeeOauthEntity;
  }

  async getSingleShopeeOauth(id: Uuid): Promise<ShopeeOauthEntity> {
    const queryBuilder = this.shopeeOauthRepository
      .createQueryBuilder('shopeeOauth')
      .where('shopeeOauth.id = :id', { id });

    const shopeeOauthEntity = await queryBuilder.getOne();

    if (!shopeeOauthEntity) {
      throw new ShopeeOauthNotFoundException();
    }

    return shopeeOauthEntity;
  }

  async deleteShopeeOauth(id: Uuid): Promise<void> {
    const queryBuilder = this.shopeeOauthRepository
      .createQueryBuilder('shopeeOauth')
      .where('shopeeOauth.id = :id', { id });

    const shopeeOauthEntity = await queryBuilder.getOne();

    if (!shopeeOauthEntity) {
      throw new ShopeeOauthNotFoundException();
    }

    await this.shopeeOauthRepository.remove(shopeeOauthEntity);
  }
}
