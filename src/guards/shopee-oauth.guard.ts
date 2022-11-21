import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { IShopeeOauthRequest } from '../modules/shopee-oauth/shopee-oauth.service';
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

    return this.shopeeOauthService.canActivate(request as IShopeeOauthRequest);
  }
}
