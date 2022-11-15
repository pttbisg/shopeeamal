import type {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {
  Catch,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';

import {
  ShopeeOauthForbiddenException,
  ShopeeOauthUnathorizedException,
} from '../exceptions/shopee-oauth.exception';

@Catch(UnauthorizedException, ForbiddenException)
export class AuthFailedFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message: string;

    switch (exception.name) {
      case UnauthorizedException.name:
        message = 'Unauthorized API access. Please provide the correct API Key';
        break;
      case ForbiddenException.name:
        message =
          'Forbidden API access. Please access the resource according to API Key Role';
        break;
      case ShopeeOauthUnathorizedException.name:
        message =
          // eslint-disable-next-line max-len
          'Unauthorized Shopee access. Please provide the correct shop_id and make sure the shop already give the permission to this service for accessing their Shopee resource via Oauth';
        break;
      case ShopeeOauthForbiddenException.name:
        message =
          // eslint-disable-next-line max-len
          'Forbidden Shopee access. Please make sure the shop already give the permission to this service for accessing their Shopee resource via Oauth';
        break;
      default:
        message = 'Unauthorized';
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
