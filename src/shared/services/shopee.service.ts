import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import type { ShopeeOauthEntity } from 'modules/shopee-oauth/shopee-oauth.entity';
import type { UserEntity } from 'modules/user/user.entity';

import { UserEnvironment, UserLocation } from '../../constants';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class ShopeeService {
  private host: string;

  private userConfig: UserEntity;

  private oauthConfig?: ShopeeOauthEntity;

  constructor(public configService: ApiConfigService) {
    this.setConfig(
      configService.isProduction ? UserEnvironment.LIVE : UserEnvironment.TEST,
    );
  }

  public get baseUrl(): string {
    return this.host;
  }

  public getFullUrl(basePath: string, query?: Record<string, string>): string {
    const url = new URL(this.getFullPath(basePath), this.baseUrl);
    const params = new URLSearchParams(query);

    return `${url}${params}`;
  }

  public buildFullUrl(
    basePath: string,
    baseQuery?: Record<string, string>,
  ): string {
    const timestamp = this.timestamp;
    const query = {
      timestamp,
      sign: this.getSignature(basePath, timestamp),
      partnerId: this.userConfig.partnerId,
      ...(this.oauthConfig && {
        shop_id: this.oauthConfig.shopId,
        access_token: this.oauthConfig.accessToken,
      }),
      ...baseQuery,
    };

    return this.getFullUrl(basePath, query);
  }

  public getFullPath(basePath?: string): string {
    return `/api/v2/${basePath}`;
  }

  private setConfig(env: string, location?: string) {
    if (env === UserEnvironment.LIVE && location === UserLocation.China) {
      this.host = 'https://openplatform.shopee.cn';
    } else if (location === UserLocation.China) {
      this.host = 'https://openplatform.test-stable.shopee.cn/';
    } else if (env === UserEnvironment.LIVE) {
      this.host = 'https://partner.shopeemobile.com/';
    } else {
      this.host = 'https://partner.test-stable.shopeemobile.com/';
    }
  }

  public set user(user: UserEntity) {
    this.userConfig = user;
    this.setConfig(user.environment, user.location);
  }

  public set shopeeOauth(shopeeOauth: ShopeeOauthEntity) {
    this.oauthConfig = shopeeOauth;
  }

  public get timestamp() {
    return Date.now().toString();
  }

  public getSignature(basePath: string, timestamp: string) {
    const message = `${this.userConfig.partnerId}${this.getFullPath(
      basePath,
    )}${timestamp}`;

    return crypto
      .createHmac('sha256', this.userConfig.partnerKey)
      .update(message)
      .digest('hex');
  }
}
