import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserEntity } from 'modules/user/user.entity';

import {
  ShopeeOauthForbiddenException,
  ShopeeOauthUnathorizedException,
} from '../exceptions/shopee-oauth.exception';
import { ShopeeOauthService } from '../modules/shopee-oauth/shopee-oauth.service';
import { ShopeeService } from '../shared/services/shopee.service';

@Injectable()
export class ShopeeOauthGuard implements CanActivate {
  constructor(
    private shopeeService: ShopeeService,
    @Inject(ShopeeOauthService)
    private shopeeOauthService: ShopeeOauthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    const partnerId = user.partnerId;
    const userId: string = request.query?.user_id;
    this.shopeeService.user = user;

    if (!userId) {
      throw new ShopeeOauthUnathorizedException(
        'Unauthorized access to this API. user_id must be provided to determine Shopee Oauth',
      );
    }

    const oauth = await this.shopeeOauthService.getAuthorizedOauth(
      partnerId,
      userId,
      request.query?.shop_id as number,
    );

    if (!oauth) {
      throw new ShopeeOauthUnathorizedException(
        'Oauth is not authorized. Request the access/refresh token first',
      );
    }

    if (oauth.isRefreshTokenExpired) {
      throw new ShopeeOauthUnathorizedException(
        'Refresh Token is expired. Ask the user to reauthorize this service to their Shopee account',
      );
    }

    request.shopeeOauth = oauth;

    if (oauth.isAccessTokenExpired) {
      try {
        this.shopeeService.oauth = oauth;
        const { oauth: updatedOauth } =
          await this.shopeeOauthService.refreshToken(oauth);
        request.shopeeOauth = updatedOauth;
      } catch (error) {
        if (error instanceof ServiceUnavailableException) {
          throw new ServiceUnavailableException({
            message: 'Error on Shopee side when refreshing access token',
            error: error.getResponse(),
          });
        } else if (
          error instanceof ShopeeOauthUnathorizedException ||
          error instanceof ShopeeOauthForbiddenException
        ) {
          throw new ShopeeOauthUnathorizedException({
            message:
              'Unauthorized access on Shopee side when refreshing access token. ' +
              'Try to ask the user to reauthorize this service to their Shopee account',
            error: error.getResponse(),
          });
        } else if (error instanceof HttpException) {
          throw new InternalServerErrorException({
            message: 'Internal error when refreshing access token',
            error: error.getResponse(),
          });
        }

        throw error;
      }
    }

    this.shopeeService.oauth = request.shopeeOauth;

    return true;
  }
}
