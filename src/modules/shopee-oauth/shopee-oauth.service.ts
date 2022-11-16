import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { QueryOptionsDto } from 'common/dto/query-options.dto';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { ShopeeOauthStatus } from '../../constants';
import { UserEntity } from '../../modules/user/user.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ShopeeService } from '../../shared/services/shopee.service';
import type {
  GetAccessTokenByResendCodePayloadDto,
  GetAccessTokenPayloadDto,
} from './dtos/get-access-token-payload.dto';
import { OauthUrlOptionsDto } from './dtos/oauth-url-options.dto';
import { ShopeeOauthDto } from './dtos/shopee-oauth.dto';
import { ShopeeOauthNotFoundException } from './exceptions/shopee-oauth-not-found.exception';
import { ShopeeOauthEntity } from './shopee-oauth.entity';

@Injectable()
export class ShopeeOauthService {
  private readonly logger = new Logger(ShopeeOauthService.name);

  refreshAcessToken(_createShopeeOauthDto: ShopeeOauthDto) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(ShopeeOauthEntity)
    private shopeeOauthRepository: Repository<ShopeeOauthEntity>,
    private shopeeService: ShopeeService,
    private apiConfigService: ApiConfigService,
  ) {}

  getOauthUrl(user: UserEntity, baseUrl: string, options: OauthUrlOptionsDto) {
    const callbackUrl = new URL('/callback', baseUrl);
    callbackUrl.searchParams.set('partner_id', user.partnerId);
    options.redirect_url ??= this.apiConfigService.shopeeOauthRedirectUrl;

    for (const [key, value] of Object.entries(options)) {
      callbackUrl.searchParams.set(key, `${value}`);
    }

    this.shopeeService.user = user;

    return this.shopeeService.buildFullUrl('shop/auth_partner', {
      redirect: callbackUrl.toString(),
    });
  }

  @Transactional()
  async initializeOauth(user: UserEntity, options: OauthUrlOptionsDto) {
    const params = {
      partnerId: user.partnerId,
      userId: options.user_id,
      ...(options.shop_id && { shopId: options.shop_id }),
    };
    let oauth = await this.shopeeOauthRepository.findOneBy(params);

    if (!oauth) {
      oauth = this.shopeeOauthRepository.create({
        status: ShopeeOauthStatus.INITIALIZED,
        ...params,
      });
    }

    // Oauth may already active. For now, allow to initialize regardless of status and do not reset
    // oauth.status: ShopeeOauthStatus.INITIALIZED
    await this.shopeeOauthRepository.save(oauth);

    return oauth.status;
  }

  async getInitializedOauth(
    partnerId: string,
    userId: string,
    shopId?: string,
  ) {
    const params = {
      partnerId,
      userId,
      shopId,
      // status: ShopeeOauthStatus.INITIALIZED // Ignore this for current flow
    };

    return this.shopeeOauthRepository.findOne({
      where: params,
      order: { createdAt: 'DESC' },
    });
  }

  async getAccessToken(
    partnerId: string,
    query: QueryOptionsDto,
    payload: GetAccessTokenPayloadDto,
    shouldResend = false,
  ) {
    const shopId = query.shop_id || payload.shop_id?.toString();
    const oauth = await this.getInitializedOauth(
      partnerId,
      query.user_id,
      //   shopId, //
    );

    if (!oauth) {
      throw new NotFoundException(
        'Oauth is not initialized. Request the login URL first',
      );
    }

    if (
      oauth.status !== ShopeeOauthStatus.INITIALIZED &&
      oauth.status !== ShopeeOauthStatus.AUTHORIZED
    ) {
      this.logger.warn(
        'There is attempt to get the access token for uninitialized/unathorized user',
      );
    }

    oauth.status = ShopeeOauthStatus.AUTHORIZED;
    oauth.shopId = shopId ?? oauth.shopId;
    oauth.mainAccountId =
      payload.main_account_id?.toString() ?? oauth.mainAccountId;
    await this.shopeeOauthRepository.save(oauth);

    const response = await this.shopeeService.apiPost(
      shouldResend ? 'get_token_by_resend_code' : 'access_token/get',
      payload,
      {
        partner_id: partnerId,
        ...query,
      },
    );

    const refreshTokenDuration = 30 * 24 * 60 * 60 * 60; // 30 days
    const timestamp = Date.now();

    oauth.accessToken = response.access_token;
    oauth.refreshToken = response.refresh_token;
    oauth.accessTokenUpdatedAt = new Date(timestamp);
    oauth.refreshTokenUpdatedAt = new Date(timestamp);
    oauth.accessTokenExpiredAt = new Date(
      timestamp + (response.expire_in as number),
    );
    oauth.refreshTokenExpiredAt = new Date(timestamp + refreshTokenDuration);
    oauth.status = ShopeeOauthStatus.ACTIVE;
    oauth.merchantIds ??= response.merchant_id_list;
    oauth.shopIds ??= response.shop_id_list;

    await this.shopeeOauthRepository.save(oauth);

    return response;
  }

  getAccessTokenByResendCode(
    partnerId: string,
    query: QueryOptionsDto,
    payload: GetAccessTokenByResendCodePayloadDto,
  ) {
    return this.getAccessToken(partnerId, query, {
      code: payload.resend_code,
      ...payload,
    });
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
