import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { QueryOptionsDto } from 'common/dto/query-options.dto';
import { IsNull, Not, Repository } from 'typeorm';
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

  constructor(
    @InjectRepository(ShopeeOauthEntity)
    private shopeeOauthRepository: Repository<ShopeeOauthEntity>,
    private shopeeService: ShopeeService,
    private apiConfigService: ApiConfigService,
  ) {}

  getOauthUrl(user: UserEntity, baseUrl: string, options: OauthUrlOptionsDto) {
    const callbackUrl = new URL('/shopee/auth/callback', baseUrl);
    callbackUrl.searchParams.set('partner_id', `${user.partnerId}`);
    options.callback_url ??= this.apiConfigService.shopeeOauthRedirectUrl;

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
    partnerId: number,
    userId: string,
    shopId?: number,
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

  async getAuthorizedOauth(partnerId: number, userId: string, shopId?: number) {
    const params = {
      partnerId,
      userId,
      shopId,
      refreshToken: Not(IsNull()),
      //   status: In([ShopeeOauthStatus.ACTIVE, ShopeeOauthStatus.INACTIVE]), // Ignore the expired
    };

    return this.shopeeOauthRepository.findOne({
      where: params,
      order: { createdAt: 'DESC' },
    });
  }

  async getAccessToken(
    user: UserEntity,
    query: QueryOptionsDto,
    payload: GetAccessTokenPayloadDto,
    shouldResend = false,
  ) {
    this.shopeeService.user = user;
    const partnerId = user.partnerId;
    const shopId = query.shop_id || payload.shop_id;
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
    oauth.mainAccountId = payload.main_account_id ?? oauth.mainAccountId;
    await this.shopeeOauthRepository.save(oauth);

    const shopeePayload = {
      partner_id: partnerId,
      ...payload,
      shop_id: shopId,
    };
    this.shopeeService.oauth = oauth;
    const response = await this.shopeeService.apiPost(
      shouldResend ? 'get_token_by_resend_code' : 'auth/token/get',
      shopeePayload,
    );

    const updatedOauth = this.buildRefreshedOauthFromResponse(oauth, response);

    await this.shopeeOauthRepository.save(updatedOauth);

    return response;
  }

  getAccessTokenByResendCode(
    user: UserEntity,
    query: QueryOptionsDto,
    payload: GetAccessTokenByResendCodePayloadDto,
  ) {
    return this.getAccessToken(user, query, {
      code: payload.resend_code,
      ...payload,
    });
  }

  async refreshAccessToken(user: UserEntity, query: QueryOptionsDto) {
    this.shopeeService.user = user;

    const oauth = await this.getAuthorizedOauth(
      user.partnerId,
      query.user_id,
      query.shop_id,
    );

    if (!oauth) {
      throw new NotFoundException(
        'Oauth is not authorized. Request the access/refresh token first',
      );
    }

    const { response } = await this.refreshToken(oauth);

    return response;
  }

  async refreshToken(oauth: ShopeeOauthEntity) {
    const payload = {
      refresh_token: oauth.refreshToken,
      partner_id: oauth.partnerId,
      shop_id: oauth.shopId,
    };

    this.shopeeService.oauth = oauth;

    const response = await this.shopeeService.apiPost(
      'auth/access_token/get',
      payload,
    );

    const updatedOauth = this.buildRefreshedOauthFromResponse(oauth, response);
    await this.shopeeOauthRepository.save(updatedOauth);

    return { oauth: updatedOauth, response };
  }

  buildRefreshedOauthFromResponse(oauth: ShopeeOauthEntity, response) {
    const refreshTokenDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
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

    return oauth;
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
