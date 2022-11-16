import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import type { ShopeeOauthEntity } from 'modules/shopee-oauth/shopee-oauth.entity';
import type { UserEntity } from 'modules/user/user.entity';
import fetch from 'node-fetch';

import { UserEnvironment, UserLocation } from '../../constants';
import {
  ShopeeOauthForbiddenException,
  ShopeeOauthUnathorizedException,
} from '../../exceptions/shopee-oauth.exception';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class ShopeeService {
  private readonly logger = new Logger(ShopeeService.name);

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

  public getFullUrl(basePath: string, query?): string {
    const url = new URL(this.getFullPath(basePath), this.baseUrl);

    const supportedQuery = Object.entries(query as Record<string, unknown>)
      .filter(
        ([_, value]) =>
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value instanceof Date, // Date will be default ISO format without ':'
      )
      .map(([key, value]) => [key, value as string]);
    const params = new URLSearchParams(supportedQuery);

    return `${url}?${params}`;
  }

  public buildFullUrl(basePath: string, baseQuery?): string {
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
    } else if (
      env === UserEnvironment.SANDBOX &&
      location === UserLocation.China
    ) {
      this.host = 'https://openplatform.test-stable.shopee.cn/';
    } else if (env === UserEnvironment.LIVE) {
      this.host = 'https://partner.shopeemobile.com/';
    } else if (env === UserEnvironment.SANDBOX) {
      this.host = 'https://partner.test-stable.shopeemobile.com/';
    } else {
      this.host = this.configService.shopeeApiMockUrl;
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

  public async apiPost(path: string, payload, query?) {
    const url = this.getFullUrl(path, query);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    this.logger.debug({
      request: {
        url,
        payload,
      },
      response: {
        status: response.status,
        data,
      },
    });

    if (!response.ok || data.error) {
      this.throwShopeeSpecificError(response.status, data);
    }

    return data;
  }

  private throwShopeeSpecificError(status: number, error) {
    switch (status) {
      case HttpStatus.NOT_FOUND:
        throw new InternalServerErrorException({
          shopee_error: error,
          message: 'Implementation error. Shopee API is not found',
        });
      case HttpStatus.UNAUTHORIZED:
        throw new ShopeeOauthUnathorizedException({ shopee_error: error });
      case HttpStatus.FORBIDDEN:
        throw new ShopeeOauthForbiddenException({ shopee_error: error });
    }

    const errorCode: string = error.error ?? '';
    const errorMessage: string = error.message ?? error.msg ?? '';
    const requiredParams = ['partner_id', 'shop_id', 'timestamp', 'sign'];

    switch (errorCode) {
      case 'error_param':
        if (requiredParams.some((param) => errorMessage.includes(param))) {
          throw new InternalServerErrorException({
            shopee_error: error,
            message:
              'Implementation error. One of the required parameters that are handled by this service cannot be provided automatically',
          });
        }

        throw new BadRequestException({
          shopee_error: error,
          message:
            'Request parameter error. Check if the parameter is valid from client side or if there is issue on this service',
        });
      case 'error_auth':
        throw new ShopeeOauthForbiddenException({ shopee_error: error });
      case 'error_sign':
        throw new InternalServerErrorException({
          shopee_error: error,
          message: 'Implementation error. Shopee API sign is wrong',
        });
      case 'error_network':
        throw new ServiceUnavailableException({
          shopee_error: error,
          message: 'Network error on internal Shopee side',
        });
    }

    throw new InternalServerErrorException({
      shopee_error: error,
      message: 'Unknown error when accessing Shopee API',
    });
  }
}
