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

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(
      query as Record<string, unknown>,
    )) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        params.append(key, `${value}`);
      } else if (value instanceof Date) {
        params.append(key, `${Math.floor(value.getTime() / 1000)}`);
      } else if (Array.isArray(value)) {
        // TODO: Make this as recursive function instead
        // TODO: Handle case where some Shopee API need to be formatted as (1) param=a,b,c and other as (2) param=a&param=b&param=c
        // For now, we assume that the (1) case will already formatted as string from API parameter
        for (const v of value) {
          params.append(key, `${v}`);
        }
      }
    }

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

    let response;

    try {
      response = await fetch(url, fetchOptions);
    } catch {
      throw new InternalServerErrorException({
        message: 'Error when accessing Shopee API',
      });
    }

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
      this.throwShopeeSpecificError(response.status as number, data);
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
      case 'error.param':
      case 'logistics.error_param':
      case 'logistics.error_token':
        if (requiredParams.some((param) => errorMessage.includes(param))) {
          throw new InternalServerErrorException({
            shopee_error: error,
            message:
              'Implementation error when accessing Shopee API. ' +
              'One of the required parameters that are handled by this service cannot be provided automatically',
          });
        }

        throw new BadRequestException({
          shopee_error: error,
          message:
            'Request parameter error. Check if the parameter is valid from client side or if there is issue on this service',
        });
      case 'error_param_shop_id_not_found':
      case 'error_shop_not_found':
      case 'common.invalid_shop':
        throw new InternalServerErrorException({
          shopee_error: error,
          message:
            'Implementation error when accessing Shopee API. ' +
            'One of the required parameters that are handled by this service cannot be provided automatically',
        });
      case 'error_not_found':
      case 'error_item_not_found':
      case 'product.error_item_not_found':
      case 'logistics.invalid_error':
      case 'logistics.package_not_exist':
      case 'logistics.package_number_not_exist':
      case 'logistics.address_not_found':
      case 'logistics.buyer_address_not_found':
      case 'logistics.error_not_exist':
      case 'logistics.error_item_not_found':
      case 'logistics.error_logistic_txn_not_found':
      case 'logistics.error_return_tracking_num_not_found':
      case 'logistics.error_zipcode_not_found':
      case 'logistics.not_found':
      case 'logistics.order not found':
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
      case 'logistics.error_ip':
        throw new InternalServerErrorException({
          shopee_error: error,
          message: 'This Service IP is denied by Shopee',
        });
      case 'order.order_list_invalid_time':
      case 'error_param_item_status':
      case 'error_update_time_range':
      case 'error_invalid_language':
      case 'error_desc_image_no_pass':
      case 'logistics.error_status_limit':
      case 'logistics.ship_order_only_support_one_type':
      case 'logistics.address_not_supported':
      case 'logistics.ADDRESS_NOT_SUPPORT':
      case 'logistics.block_buyer_name':
      case 'logistics.business_process_error':
      case 'logistics.business_validation_error':
      case 'logistics.cancel_not_allowed':
      case 'logistics.category_prohibited':
      case 'logistics.default_warehouse_not_set':
      case 'logistics.error_address':
      case 'logistics.error_limit':
      case 'logistics.error_buyer_addressid':
      case 'logistics.error_cannot_cancel_logistic_txn':
      case 'logistics.error_consignment':
      case 'logistics.error_consignment_no_accepted':
      case 'logistics.error_cutoff_time':
      case 'logistics.error_decimal':
      case 'logistics.error_duplicate_consignment':
      case 'logistics.error_duplicated_consignment':
      case 'logistics.error_failed_get_nearest_whs_idn':
      case 'logistics.error_format':
      case 'logistics.error_invalid_channel_id':
      case 'logistics.error_loginfo':
      case 'logistics.error_logistics_shop_require_pickup_address':
      case 'logistics.error_message_type':
      case 'logistics.error_missing_cdt':
      case 'logistics.error_no_pickup':
      case 'logistics.error_no_pickup_address':
      case 'logistics.error_operation_failed':
      case 'logistics.error_order_context':
      case 'logistics.error_order_state':
      case 'logistics.error_phone':
      case 'logistics.error_pickup_time':
      case 'logistics.error_seller_never_apply_tracking_no_before':
      case 'logistics.error_sender_address':
      case 'logistics.error_set_asf_by_weight':
      case 'logistics.error_set_seller_address':
      case 'logistics.error_traceno_required':
      case 'logistics.error_unsupported':
      case 'logistics.error_unsupported_address':
      case 'logistics.error_update':
      case 'logistics.error_update_logistic_unsupported':
      case 'logistics.feature_not_supported':
      case 'logistics.invalid_size':
      case 'logistics.error_data':
      case 'logistics.item_is_in_bundle':
      case 'logistics.lack_of_invoice_data':
      case 'lack_of_invoice_data':
      case 'logistics.max dimension is limited':
      case 'logistics.missing_cdt':
      case 'logistics.no buyer_store':
      case 'logistics.no_proportion':
      case 'logistics.order_finalized':
      case 'logistics.order_has_no_seller_address':
      case 'logistics.order_prescription_unchecked':
      case 'logistics.parcel_amount_over_limit':
      case 'logistics.pickup_whitelist_not_supported':
      case 'logistics.pickup_address_unsupported':
      case 'logistics.price_error':
      case 'logistics.quantity_error':
      case 'logistics.seller_address_not_support_cod':
      case 'logistics.ship_order_invalid_job_param':
      case 'logistics.ship_order_long_sender_real_name':
      case 'logistics.ship_order_long_tracking_number':
      case 'logistics.ship_order_need_address_pickup_time':
      case 'logistics.ship_order_need_branch_id':
      case 'logistics.ship_order_need_pacakge_number':
      case 'logistics.ship_order_need_sender_real_name':
      case 'logistics.ship_order_need_tracking_number':
      case 'logistics.ship_order_not_need_pacakge_number':
      case 'logistics.ship_order_not_ready_to_ship':
      case 'logistics.ship_order_pff_init':
      case 'logistics.ship_order_pickup_time_invalid':
      case 'logistics.ship_order_unsupport_dropoff':
      case 'logistics.ship_order_unsupport_non_integrated':
      case 'logistics.ship_order_unsupport_pickup':
      case 'logistics.shop_not_support_wms':
      case 'logistics.sls calculate fail':
        throw new BadRequestException({
          shopee_error: error,
          message: 'Request parameter error. See shopee_error for the details',
        });
      case 'error_server':
      case 'error_network':
      case 'error_system_busy':
      case 'error_inner':
      case 'error_query_condition_list_limit':
      case 'error_query_query_limit_too_large':
      case 'error_get_shop_fail':
      case 'error_slash_price_load':
      case 'logistics.error_channel_exist':
      case 'logistics.error_other':
      case 'logistics.error_connection':
      case 'logistics.error_core_server':
      case 'logistics.error_third_party_server':
      case 'logistics.error_timeout':
      case 'logistics.error_too_many_invoke_function':
      case 'logistics.error_unknown':
      case 'logistics.logistic_order_is_locked_on_creating':
        throw new ServiceUnavailableException({
          shopee_error: error,
          message: 'Service error on internal Shopee side',
        });

      default:
        if (errorCode.includes('not_found')) {
          throw new NotFoundException({
            shopee_error: error,
            message: 'Request parameter error. Resource not found',
          });
        }
    }

    switch (status) {
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException({
          shopee_error: error,
          message:
            'Not Found. Check the error to know whether the resource not exist in the request parameter, ' +
            'or if this is implementation error',
        });
      case HttpStatus.UNAUTHORIZED:
        throw new ShopeeOauthUnathorizedException({ shopee_error: error });
      case HttpStatus.FORBIDDEN:
        throw new ShopeeOauthForbiddenException({ shopee_error: error });
      case HttpStatus.INTERNAL_SERVER_ERROR:
      case HttpStatus.NOT_IMPLEMENTED:
      case HttpStatus.BAD_GATEWAY:
      case HttpStatus.SERVICE_UNAVAILABLE:
        throw new ServiceUnavailableException({ shopee_error: error });
      case HttpStatus.OK:
        throw new BadRequestException({
          shopee_error: error,
          message:
            'Error response from Shopee. Check the request parameter and message',
        });
    }

    throw new InternalServerErrorException({
      shopee_error: error,
      message:
        'Unknown error when accessing Shopee API. Check the error message to determine if it is caused by wrong Request Parameter',
    });
  }
}
