import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Scope,
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

// The instance will be different for each request unlike other service
// Allowing the config to be safely set and be removed after the request is completed
@Injectable({ scope: Scope.REQUEST })
export class ShopeeService {
  private readonly logger = new Logger(ShopeeService.name);

  private host: string;

  private userConfig?: UserEntity;

  private oauthConfig?: ShopeeOauthEntity;

  constructor(public configService: ApiConfigService) {
    this.setConfig(
      configService.isProduction ? UserEnvironment.LIVE : UserEnvironment.TEST,
    );
  }

  public get baseUrl(): string {
    return this.host;
  }

  public set user(user: UserEntity) {
    this.userConfig = user;
    this.setConfig(user.environment, user.location);
  }

  public get user(): UserEntity {
    if (!this.userConfig) {
      throw new InternalServerErrorException(
        'Implementation error. Attempting to access Shopee API with unknown user/partner_id',
      );
    }

    return this.userConfig;
  }

  public set oauth(oauth: ShopeeOauthEntity) {
    this.oauthConfig = oauth;
  }

  public get oauth(): ShopeeOauthEntity {
    if (!this.oauthConfig) {
      throw new InternalServerErrorException(
        'Implementation error. Attempting to access Shopee API without valid Oauth',
      );
    }

    return this.oauthConfig;
  }

  // in seconds instead of milliseconds for Shopee usage
  public get timestamp() {
    return Math.floor(Date.now() / 1000).toString();
  }

  private getFullUrl(basePath: string, query?): string {
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
      partner_id: this.user.partnerId,
      ...(this.isOauthResource(basePath) &&
        this.oauthConfig && {
          shop_id: this.oauth.shopId,
          access_token: this.oauth.accessToken,
        }),
      ...baseQuery,
    };

    return this.getFullUrl(basePath, query);
  }

  public isOauthResource(basePath?: string): boolean {
    const publicPath = ['auth', 'public', 'shop'];

    return !publicPath.some((path) =>
      this.getFullPath(basePath).startsWith(this.getFullPath(path)),
    );
  }

  public getFullPath(basePath?: string): string {
    if (basePath?.startsWith('/')) {
      basePath = basePath.slice(1);
    }

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

  public getSignature(basePath: string, timestamp: string) {
    let message = `${this.user.partnerId}${this.getFullPath(
      basePath,
    )}${timestamp}`;

    if (this.isOauthResource(basePath)) {
      message += `${this.oauth.accessToken}${this.oauth.shopId}`;
      //TODO: Handle path for Merchant API, use merchant id instead of shopId
    }

    return crypto
      .createHmac('sha256', this.user.partnerKey)
      .update(message)
      .digest('hex');
  }

  private async apiCall(
    path: string,
    options: {
      query?;
      payload?;
      method?;
    },
  ) {
    const query = options.query ?? {};
    const method = options.method ?? 'POST';
    const payload = options.payload ?? {};
    const url = this.buildFullUrl(path, query);

    const fetchOptions: Record<string, unknown> = { method };

    if (method === 'POST') {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify(payload);
    }

    const response = await fetch(url, fetchOptions);
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

  public async apiPost(path: string, payload, query?) {
    return this.apiCall(path, {
      payload,
      query,
      method: 'POST',
    });
  }

  public async apiGet(path: string, query?) {
    return this.apiCall(path, {
      query,
      method: 'GET',
    });
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
    const requiredParams = [
      'partner_id',
      'shop_id',
      'timestamp',
      'sign',
      'access_token',
    ];

    switch (errorCode) {
      case 'error_param':
        if (requiredParams.some((param) => errorMessage.includes(param))) {
          throw new InternalServerErrorException({
            shopee_error: error,
            message:
              'Implementation error when acessing Shopee API. ' +
              'One of the required parameters that are handled by this service cannot be provided automatically',
          });
        }

        throw new BadRequestException({
          shopee_error: error,
          message:
            'Request parameter error. Check if the parameter is valid from client side or if there is issue on this service',
        });
      case 'error_not_found':
        throw new NotFoundException({
          shopee_error: error,
          message: 'Request parameter error. Resource not found',
        });
      case 'error_auth':
      case 'error_permission':
        throw new ShopeeOauthForbiddenException({ shopee_error: error });
      case 'error_sign':
        throw new InternalServerErrorException({
          shopee_error: error,
          message: 'Implementation error. Shopee API sign is wrong',
        });
      case 'error_server':
        throw new ServiceUnavailableException({
          shopee_error: error,
          message: 'Server error on internal Shopee side',
        });
      case 'error_network':
        throw new ServiceUnavailableException({
          shopee_error: error,
          message: 'Network error on internal Shopee side',
        });
      case 'order.order_list_invalid_time':
        throw new NotFoundException({
          shopee_error: error,
          message: 'Request parameter error. See shopee_error for the details',
        });
    }

    throw new InternalServerErrorException({
      shopee_error: error,
      message: 'Unknown error when accessing Shopee API',
    });
  }
}
